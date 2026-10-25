import urllib.request
import urllib.parse
import json
import base64
import sys
import io
import os
import http.cookiejar

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:3001"

def read_admin_password():
    # Read admin password from environment or .env.local safely
    pw = os.environ.get("ADMIN_PASSWORD")
    if pw:
        return pw
    env_file = os.path.join(os.path.dirname(__file__), ".env.local")
    if os.path.exists(env_file):
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("ADMIN_PASSWORD="):
                    return line.split("=", 1)[1].strip()
    return ""

def run_tests():
    print("==================================================")
    print("🍎 STARTING SECURITY & FLOW VERIFICATION TEST 🍎")
    print("==================================================")

    cookie_jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))

    # -----------------------------------------------------------------
    # 1. TEST PUBLIC DATA EXPOSURE RESTRICTIONS (Task 2)
    # -----------------------------------------------------------------
    print("\n--- [Test 1] Public Data Exposure Restrictions ---")
    
    # 1a. Public GET /api/orders without credentials must fail (401)
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/orders")
        with urllib.request.urlopen(req) as res:
            assert False, "FAIL: Public was able to read all orders!"
    except urllib.error.HTTPError as e:
        assert e.code == 401
        print("✓ Verified: Public GET /api/orders is blocked with 401 Unauthorized")

    # 1b. Public GET /api/queues returns ONLY sanitized data
    req = urllib.request.Request(f"{BASE_URL}/api/queues")
    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode('utf-8'))
        assert data["success"] == True
        queues = data["queues"]
        print(f"✓ Public GET /api/queues returned {len(queues)} sanitized queues")
        if queues:
            sample_q = queues[0]
            assert "contact_info" not in sample_q, "LEAK: contact_info present in public queues!"
            assert "order_no" not in sample_q, "LEAK: full order_no present in public queues!"
            assert "*" in sample_q["customer_name"], f"LEAK: customer_name is not masked: {sample_q['customer_name']}"
            print(f"  Sanitized queue sample: Queue #{sample_q['queue_no']} - {sample_q['customer_name']} ({sample_q['status']})")
            print("✓ Verified: Public queue data contains zero contact info or personal identifiers")

    # -----------------------------------------------------------------
    # 2. TEST SERVER-SIDE ADMIN AUTHENTICATION (Task 1)
    # -----------------------------------------------------------------
    print("\n--- [Test 2] Server-Side Backoffice Auth Enforcement ---")

    protected_endpoints = [
        ("POST", f"{BASE_URL}/api/store", {"action": "save_settings", "settings": {}}),
        ("POST", f"{BASE_URL}/api/orders/verify", {"order_id": "fake-id"}),
        ("POST", f"{BASE_URL}/api/queues", {"action": "update_status", "queue_id": "fake", "status": "เสร็จแล้ว"}),
        ("DELETE", f"{BASE_URL}/api/queues?id=fake", None),
    ]

    for method, url, payload in protected_endpoints:
        try:
            data = json.dumps(payload).encode('utf-8') if payload else None
            headers = {"Content-Type": "application/json"} if payload else {}
            req = urllib.request.Request(url, data=data, headers=headers, method=method)
            with urllib.request.urlopen(req) as res:
                assert False, f"FAIL: Unauthenticated {method} {url} was allowed!"
        except urllib.error.HTTPError as e:
            assert e.code == 401, f"Expected 401 for {url}, got {e.code}"
            print(f"✓ Verified: Unauthenticated {method} {urllib.parse.urlparse(url).path} blocked with 401")

    # 2b. Admin Login with Wrong Password
    wrong_req = urllib.request.Request(
        f"{BASE_URL}/api/admin/login",
        data=json.dumps({"password": "completely_wrong_password"}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(wrong_req) as res:
            assert False, "FAIL: Wrong password was accepted!"
    except urllib.error.HTTPError as e:
        assert e.code == 401
        print("✓ Verified: Login with wrong password rejected with 401")

    # 2c. Admin Login with Valid Password
    admin_pw = read_admin_password()
    assert admin_pw, "Admin password must be set in .env.local"
    login_req = urllib.request.Request(
        f"{BASE_URL}/api/admin/login",
        data=json.dumps({"password": admin_pw}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with opener.open(login_req) as res:
        login_res = json.loads(res.read().decode('utf-8'))
        assert login_res["success"] == True
        # Check Set-Cookie
        cookies = [c for c in cookie_jar if c.name == "apple_admin_session"]
        assert len(cookies) > 0, "Set-Cookie apple_admin_session not found!"
        session_cookie = cookies[0]
        print(f"✓ Admin login succeeded. HttpOnly cookie set: {session_cookie.name}")

    # 2d. Check /api/admin/session with cookie
    sess_req = urllib.request.Request(f"{BASE_URL}/api/admin/session")
    with opener.open(sess_req) as res:
        sess_data = json.loads(res.read().decode('utf-8'))
        assert sess_data["success"] == True and sess_data["authenticated"] == True
        print("✓ Verified: Server reports active admin session from HttpOnly cookie")

    # -----------------------------------------------------------------
    # 3. TEST CONTEXTUAL CHECKOUT: FORTUNE VS PHYSICAL (Task 5)
    # -----------------------------------------------------------------
    print("\n--- [Test 3] Contextual Checkout: Fortune vs Physical ---")
    
    # Fetch store products
    store_req = urllib.request.Request(f"{BASE_URL}/api/store")
    with urllib.request.urlopen(store_req) as res:
        store_data = json.loads(res.read().decode('utf-8'))["data"]
        categories = store_data["categories"]
        fortune_pkg = None
        physical_pkg = None
        for cat in categories:
            for pkg in cat["packages"]:
                if pkg.get("product_type") == "physical" and not physical_pkg:
                    physical_pkg = pkg
                elif pkg.get("product_type") != "physical" and not fortune_pkg:
                    fortune_pkg = pkg

    print(f"  Fortune Product: {fortune_pkg['name']} (฿{fortune_pkg['price']})")
    print(f"  Physical Product: {physical_pkg['name']} (฿{physical_pkg['price']})")

    # 3a. Create Fortune Order
    fortune_order_payload = {
        "customer_name": "คุณนลินดา ดูดวง",
        "birth_date": "2000-08-15",
        "birth_time": "10:30",
        "zodiac_sign": "ราศีสิงห์ (17 ส.ค. - 16 ก.ย.)",
        "question": "อยากทราบแนวโน้มความรักช่วงปลายปีนี้ค่ะ",
        "contact_channel": "LINE",
        "contact_value": "@nalinda_tarot",
        "items": [{"id": fortune_pkg["id"], "quantity": 1}]
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/orders",
        data=json.dumps(fortune_order_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        f_res = json.loads(res.read().decode('utf-8'))
        assert f_res["success"] == True
        fortune_order = f_res["order"]
        assert fortune_order["order_type"] == "fortune"
        assert fortune_order["question"] == fortune_order_payload["question"]
        assert "tracking_token" in fortune_order and fortune_order["tracking_token"].startswith("trk_")
        print(f"✓ Fortune Order created: {fortune_order['order_no']}")
        print(f"  Type: {fortune_order['order_type']}, Tracking Token: {fortune_order['tracking_token']}")

    # 3b. Create Physical Order WITHOUT shipping address -> MUST fail (400)
    invalid_phys_payload = {
        "customer_name": "คุณกานต์ พัสดุ",
        "contact_channel": "Phone",
        "contact_value": "0891112233",
        "items": [{"id": physical_pkg["id"], "quantity": 1}]
    }
    try:
        req = urllib.request.Request(
            f"{BASE_URL}/api/orders",
            data=json.dumps(invalid_phys_payload).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as res:
            assert False, "FAIL: Physical order was created without shipping address!"
    except urllib.error.HTTPError as e:
        assert e.code in [400, 500]
        print("✓ Verified: Physical order rejected when shipping address is missing")

    # 3c. Create Physical Order WITH proper shipping details
    valid_phys_payload = {
        "customer_name": "คุณกานต์ พัสดุ",
        "shipping_name": "คุณกานต์ สวนแอปเปิ้ล",
        "shipping_phone": "0891112233",
        "shipping_address": "99/1 ซอยแอปเปิ้ล ถนนสวนผลไม้",
        "shipping_subdistrict": "บางรัก",
        "shipping_district": "บางรัก",
        "shipping_province": "กรุงเทพมหานคร",
        "shipping_postal_code": "10500",
        "customer_note": "ฝากไว้ที่ป้อมยามหน้าหมู่บ้านได้เลยครับ",
        "contact_channel": "Phone",
        "contact_value": "0891112233",
        "items": [{"id": physical_pkg["id"], "quantity": 2}]
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/orders",
        data=json.dumps(valid_phys_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        p_res = json.loads(res.read().decode('utf-8'))
        assert p_res["success"] == True
        phys_order = p_res["order"]
        assert phys_order["order_type"] == "physical"
        assert phys_order["shipping_address"] == valid_phys_payload["shipping_address"]
        assert phys_order["shipping_postal_code"] == "10500"
        assert phys_order["total_amount"] == physical_pkg["price"] * 2
        assert "tracking_token" in phys_order and phys_order["tracking_token"].startswith("trk_")
        print(f"✓ Physical Order created: {phys_order['order_no']}")
        print(f"  Type: {phys_order['order_type']}, Recipient: {phys_order['shipping_name']}, Total: ฿{phys_order['total_amount']}")

    # -----------------------------------------------------------------
    # 4. TEST SECURE ORDER TRACKING (Task 2)
    # -----------------------------------------------------------------
    print("\n--- [Test 4] Secure Unguessable Order Tracking ---")
    
    # 4a. Track with order_no only (no tracking token) -> MUST fail (401)
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/orders?order_no={phys_order['order_no']}")
        with urllib.request.urlopen(req) as res:
            assert False, "FAIL: Able to access order without tracking token!"
    except urllib.error.HTTPError as e:
        assert e.code == 401
        print("✓ Verified: Tracking with order_no only is blocked (401)")

    # 4b. Track with WRONG tracking token -> MUST fail (404)
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/orders?order_no={phys_order['order_no']}&tracking_token=trk_fake_bad_token")
        with urllib.request.urlopen(req) as res:
            assert False, "FAIL: Able to access order with wrong tracking token!"
    except urllib.error.HTTPError as e:
        assert e.code == 404
        print("✓ Verified: Tracking with invalid tracking token is blocked (404)")

    # 4c. Track with VALID tracking token -> 200 OK
    track_url = f"{BASE_URL}/api/orders?order_no={phys_order['order_no']}&tracking_token={phys_order['tracking_token']}"
    with urllib.request.urlopen(track_url) as res:
        track_res = json.loads(res.read().decode('utf-8'))
        assert track_res["success"] == True
        assert track_res["order"]["order_no"] == phys_order["order_no"]
        print(f"✓ Verified: Customer successfully tracked own order: {track_res['order']['order_no']}")

    # -----------------------------------------------------------------
    # 5. TEST SLIP UPLOAD SECURITY & CONTENT VALIDATION (Task 3)
    # -----------------------------------------------------------------
    print("\n--- [Test 5] Slip Upload Security & Magic Byte Validation ---")

    # 5a. Upload to non-existent order -> MUST fail (404)
    fake_png_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
    fake_png_b64 = "data:image/png;base64," + base64.b64encode(fake_png_bytes).decode('ascii')
    try:
        req = urllib.request.Request(
            f"{BASE_URL}/api/orders/slip",
            data=json.dumps({"order_no": "APL-NONEXISTENT", "slip_data": fake_png_b64}).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as res:
            assert False, "FAIL: Slip upload succeeded for non-existent order!"
    except urllib.error.HTTPError as e:
        assert e.code == 404
        print("✓ Verified: Slip upload to non-existent order rejected with 404")

    # 5b. Upload dangerous file disguised as image (e.g. HTML/XSS script) -> MUST fail (400)
    malicious_content = b"<script>alert('pwned')</script>"
    malicious_b64 = "data:image/png;base64," + base64.b64encode(malicious_content).decode('ascii')
    try:
        req = urllib.request.Request(
            f"{BASE_URL}/api/orders/slip",
            data=json.dumps({"order_no": phys_order["order_no"], "slip_data": malicious_b64}).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as res:
            assert False, "FAIL: Disguised non-image file was accepted!"
    except urllib.error.HTTPError as e:
        assert e.code == 400
        print("✓ Verified: Non-image content (malicious text/script) rejected with 400")

    # 5c. Upload oversized file (> 5MB) -> MUST fail (400)
    oversized_fake = b"\x89PNG\r\n\x1a\n" + b"A" * (6 * 1024 * 1024)
    oversized_b64 = "data:image/png;base64," + base64.b64encode(oversized_fake).decode('ascii')
    try:
        req = urllib.request.Request(
            f"{BASE_URL}/api/orders/slip",
            data=json.dumps({"order_no": phys_order["order_no"], "slip_data": oversized_b64}).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as res:
            assert False, "FAIL: Oversized file was accepted!"
    except urllib.error.HTTPError as e:
        assert e.code == 400
        print("✓ Verified: Oversized file (> 5MB) rejected with 400")

    # 5d. Upload genuine PNG image
    req = urllib.request.Request(
        f"{BASE_URL}/api/orders/slip",
        data=json.dumps({
            "order_no": phys_order["order_no"],
            "tracking_token": phys_order["tracking_token"],
            "slip_data": fake_png_b64
        }).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        slip_res = json.loads(res.read().decode('utf-8'))
        assert slip_res["success"] == True
        updated_order = slip_res["order"]
        assert updated_order["status"] == "pending_verification"
        slip_url = updated_order["slip_url"]
        assert "slip_" in slip_url and slip_url.endswith(".png")
        print(f"✓ Verified genuine slip uploaded: {slip_url}")
        print(f"  Randomized System Filename: {updated_order.get('slip_filename')}")

    # 5e. Test secure slip download endpoint
    # Without credentials -> 401
    try:
        req = urllib.request.Request(f"{BASE_URL}{slip_url}")
        with urllib.request.urlopen(req) as res:
            assert False, "FAIL: Slip was readable without authentication or tracking token!"
    except urllib.error.HTTPError as e:
        assert e.code == 401
        print("✓ Verified: Direct slip access without credentials blocked with 401")

    # With tracking token -> 200 OK
    track_slip_url = f"{BASE_URL}{slip_url}?tracking_token={phys_order['tracking_token']}"
    with urllib.request.urlopen(track_slip_url) as res:
        assert res.status == 200
        content_type = res.headers.get("Content-Type")
        nosniff = res.headers.get("X-Content-Type-Options")
        assert content_type == "image/png"
        assert nosniff == "nosniff"
        print(f"✓ Verified: Slip served securely with Content-Type: {content_type}, X-Content-Type-Options: {nosniff}")

    # -----------------------------------------------------------------
    # 6. TEST PAYMENT VERIFICATION & QUEUE WORKFLOW (Task 1 & 4)
    # -----------------------------------------------------------------
    print("\n--- [Test 6] Payment Verification & Queue Flow with Admin Session ---")
    
    # 6a. Admin verifies payment using session cookie
    verify_req = urllib.request.Request(
        f"{BASE_URL}/api/orders/verify",
        data=json.dumps({"order_id": phys_order["id"]}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with opener.open(verify_req) as res:
        v_res = json.loads(res.read().decode('utf-8'))
        assert v_res["success"] == True
        q_item = v_res["data"]["queue"]
        print(f"✓ Payment verified by admin. Auto Queue Assigned: #{q_item['queue_no']} for {q_item['order_no']}")
        assert q_item["order_no"] == phys_order["order_no"]

    # 6b. Duplicate queue prevention test
    with opener.open(verify_req) as res:
        v2_res = json.loads(res.read().decode('utf-8'))
        assert v2_res["success"] == True
        q2 = v2_res["data"]["queue"]
        assert q2["id"] == q_item["id"]
        assert q2["queue_no"] == q_item["queue_no"]
        print("✓ Verified: Repeated verification reuses existing queue without duplicate")

    # 6c. Admin updates queue status
    update_q_req = urllib.request.Request(
        f"{BASE_URL}/api/queues",
        data=json.dumps({
            "action": "update_status",
            "queue_id": q_item["id"],
            "status": "กำลังดำเนินการ",
            "estimated_time": "จัดส่งวันพรุ่งนี้ 12:00 น.",
            "shop_note": "กำลังแพ็กกล่องสุ่มแอปเปิ้ลและเทียนหอมค่ะ 🍎📦"
        }).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with opener.open(update_q_req) as res:
        uq_res = json.loads(res.read().decode('utf-8'))
        assert uq_res["success"] == True
        print(f"✓ Admin updated queue: {uq_res['queue']['status']} - {uq_res['queue']['shop_note']}")

    # -----------------------------------------------------------------
    # 7. TEST ADMIN LOGOUT (Task 1)
    # -----------------------------------------------------------------
    print("\n--- [Test 7] Admin Logout Session Revocation ---")
    logout_req = urllib.request.Request(f"{BASE_URL}/api/admin/logout", method="POST")
    with opener.open(logout_req) as res:
        lo_res = json.loads(res.read().decode('utf-8'))
        assert lo_res["success"] == True
        print("✓ Logged out successfully")

    # Verify session is now invalid
    check_req = urllib.request.Request(f"{BASE_URL}/api/admin/session")
    with opener.open(check_req) as res:
        check_res = json.loads(res.read().decode('utf-8'))
        assert check_res["authenticated"] == False
        print("✓ Verified: Admin session revoked, authenticated = False")

    # Subsequent admin-only calls must fail with 401
    try:
        all_ord_req = urllib.request.Request(f"{BASE_URL}/api/orders")
        with opener.open(all_ord_req) as res:
            assert False, "FAIL: Read orders after logout was allowed!"
    except urllib.error.HTTPError as e:
        assert e.code == 401
        print("✓ Verified: Post-logout access blocked with 401")

    print("\n==================================================")
    print("🎉 ALL SECURITY AND CRITICAL FLOW TESTS PASSED! 🎉")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
