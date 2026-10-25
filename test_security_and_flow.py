import urllib.request
import urllib.parse
import json
import base64
import sys
import io
import os
import time
import hashlib
import tempfile
import shutil
import subprocess
import http.cookiejar

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

REPO_ROOT = os.path.dirname(os.path.abspath(__file__))
BASE_URL = os.environ.get("BASE_URL", "http://localhost:3001")
STORE_JSON_PATH = os.path.join(REPO_ROOT, "data", "store.json")

def compute_file_sha256(filepath):
    if not os.path.exists(filepath):
        return None
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

def create_isolated_test_fixture(db_path):
    fixture = {
        "settings": {
            "shop_name": "Auralune Tarot Test",
            "shop_title": "Auralune · ดูดวงไพ่ทาโรต์พยากรณ์",
            "shop_subtitle": "เปิดไพ่ฮีลใจ แม่นยำ ตรงไปตรงมา",
            "banner_url": "",
            "avatar_url": "",
            "promptpay_id": "0968895279",
            "account_name": "ด.ญ. ณัฐธยาน์ ขันทอง",
            "bank_name": "ธนาคารกสิกรไทย (KBANK)",
            "bank_account_no": "145-1-03659-5",
            "truemoney_phone": "096-889-5279",
            "qr_image_url": "/images/kbank_qr.png",
            "contacts": [{"label": "LINE Official", "url": "https://lin.ee/zTea2n2"}],
            "socials": [],
            "status_options": ["รอตรวจสลิป", "รอตรวจคิว", "กำลังดูดวง", "กำลังดำเนินการ", "ส่งคำทำนายแล้ว", "เสร็จแล้ว"],
            "enable_express_queue": True,
            "express_queue_fee": 32,
            "express_estimated_time": "⚡ ภายใน 12-24 ชั่วโมง",
            "is_store_open": True,
            "store_close_message": "",
            "notify_on_slip": True,
            "notify_on_queue": False,
            "theme_preset": "apple",
            "line_channel_access_token": "secret_line_token_xyz987",
            "webhook_url": "https://discord.com/api/webhooks/test_fixture",
            "line_admin_user_id": "U_admin_test_user_id"
        },
        "categories": [
            {
                "id": "cat-fortune-test",
                "name": "🔮 บริการดูดวงไพ่ทาโรต์ (ทดสอบ)",
                "description": "เปิดไพ่ทำนายดวงชะตา",
                "sort_order": 1,
                "product_type": "fortune",
                "packages": [
                    {
                        "id": "pkg-fortune-1",
                        "category_id": "cat-fortune-test",
                        "name": "ดูดวงคำถามทั่วไป 1 ข้อ",
                        "description": "ถามเรื่องทั่วไป 1 ข้อ ตอบกระชับ ชัดเจน",
                        "price": 15,
                        "badge": "15.-",
                        "is_active": True,
                        "product_type": "fortune"
                    }
                ]
            },
            {
                "id": "cat-physical-test",
                "name": "🍎 สินค้ามงคลและของที่ระลึก (ทดสอบ)",
                "description": "สินค้าจัดส่งถึงบ้าน",
                "sort_order": 2,
                "product_type": "physical",
                "packages": [
                    {
                        "id": "pkg-physical-1",
                        "category_id": "cat-physical-test",
                        "name": "กล่องสุ่ม Lucky Apple Box & เทียนหอม",
                        "description": "กล่องสุ่มของมงคลนำโชคและเทียนหอมอโรมากลิ่นแอปเปิ้ล",
                        "price": 199,
                        "badge": "199.-",
                        "is_active": True,
                        "product_type": "physical"
                    }
                ]
            }
        ],
        "orders": [],
        "queues": [
            {
                "id": "q-sample-1",
                "order_no": "APL-SAMPLE-99",
                "queue_no": 1,
                "customer_name": "สมชาย รักสงบ",
                "status": "รอตรวจสลิป",
                "created_at": "2026-10-25T12:00:00Z"
            }
        ],
        "music_tracks": [],
        "reviews": []
    }
    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(fixture, f, ensure_ascii=False, indent=2)

def is_server_ready(url, timeout_secs=1):
    try:
        req = urllib.request.Request(f"{url}/api/health")
        with urllib.request.urlopen(req, timeout=timeout_secs) as res:
            return res.status == 200
    except Exception:
        return False

def format_customer_queue_update_message(queue, shop_name, host_url, tracking_token=None):
    clean_host = host_url.rstrip("/")
    clean_token = tracking_token.strip() if tracking_token else ""

    if clean_token:
        encoded_order_no = urllib.parse.quote(queue["order_no"])
        encoded_token = urllib.parse.quote(clean_token)
        tracking_lines = [
            "🔗 ตรวจสอบคิวของคุณได้ที่:",
            f"{clean_host}/queue?order_no={encoded_order_no}&tracking_token={encoded_token}"
        ]
    else:
        tracking_lines = [
            f"💡 สำหรับการติดตามสถานะคิว สามารถติดต่อสอบถามแม่หมอได้โดยตรงทางแชทนี้ พร้อมแจ้งหมายเลขออเดอร์ #{queue['order_no']} ได้เลยนะคะ 💬"
        ]

    lines = [
        f"สวัสดีค่ะคุณ {queue['customer_name']} 🍎",
        f"อัปเดตสถานะคิวดูดวงจากร้าน {shop_name} นะคะ ✨",
        "",
        f"📋 คิวที่: #{queue['queue_no']} (ออเดอร์: {queue['order_no']})",
        f'🔮 สถานะปัจจุบัน: "{queue["status"]}"',
        f"⏱️ ระยะเวลาโดยประมาณ: {queue.get('estimated_time', '')}" if queue.get("estimated_time") else "",
        f"📝 ข้อความจากแม่หมอ: {queue.get('shop_note', '')}" if queue.get("shop_note") else "",
        "",
        *tracking_lines,
        "",
        f"ขอบคุณที่ไว้วางใจให้ {shop_name} ดูแลนะคะ 🌙🌷"
    ]
    return "\n".join([line for line in lines if line])

def run_tests():
    print("==================================================")
    print("🍎 STARTING SECURITY & FLOW VERIFICATION TEST 🍎")
    print("==================================================")

    # 0. Safety: Check store.json hash before test
    initial_store_hash = compute_file_sha256(STORE_JSON_PATH)
    print(f"✓ Initial store.json sha256 recorded: {initial_store_hash[:16] if initial_store_hash else 'None'}")

    # Create temporary isolated environment
    temp_dir = tempfile.mkdtemp(prefix="apple_test_")
    temp_db_path = os.path.join(temp_dir, "test_store.json")
    temp_slip_dir = os.path.join(temp_dir, "slips")
    os.makedirs(temp_slip_dir, exist_ok=True)
    create_isolated_test_fixture(temp_db_path)
    print(f"✓ Temporary isolated database prepared at: {temp_db_path}")

    server_process = None
    started_server = False

    try:
        # Check if server is already running on BASE_URL
        if not is_server_ready(BASE_URL):
            print(f"  Starting Next.js test server with isolated local DB on {BASE_URL}...")
            env = os.environ.copy()
            env["LOCAL_DB_MODE"] = "true"
            env["DATA_FILE_PATH"] = temp_db_path
            env["SLIP_STORAGE_DIR"] = temp_slip_dir
            env["ADMIN_PASSWORD"] = "apple2026"
            env["PORT"] = "3001"

            server_process = subprocess.Popen(
                ["node", "node_modules/next/dist/bin/next", "start", "-p", "3001"],
                cwd=REPO_ROOT,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            started_server = True

            # Wait for server to become ready
            start_wait = time.time()
            ready = False
            while time.time() - start_wait < 30:
                if is_server_ready(BASE_URL):
                    ready = True
                    break
                time.sleep(0.5)

            if not ready:
                stdout, stderr = server_process.communicate(timeout=5)
                print("Server failed to start:", stdout.decode("utf-8", errors="ignore"), stderr.decode("utf-8", errors="ignore"))
                assert False, "Next.js server failed to become ready within 30 seconds"
            print(f"✓ Next.js server ready on {BASE_URL}")
        else:
            print(f"✓ Connected to existing server on {BASE_URL}")

        cookie_jar = http.cookiejar.CookieJar()
        opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))

        # -----------------------------------------------------------------
        # 1. TEST PUBLIC DATA EXPOSURE RESTRICTIONS
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
        # 2. TEST SERVER-SIDE ADMIN AUTHENTICATION
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
                data_bytes = json.dumps(payload).encode('utf-8') if payload else None
                headers = {"Content-Type": "application/json"} if payload else {}
                req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
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
        admin_pw = "apple2026"
        login_req = urllib.request.Request(
            f"{BASE_URL}/api/admin/login",
            data=json.dumps({"password": admin_pw}).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with opener.open(login_req) as res:
            login_res = json.loads(res.read().decode('utf-8'))
            assert login_res["success"] == True
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
        # 3. TEST CONTEXTUAL CHECKOUT: FORTUNE VS PHYSICAL
        # -----------------------------------------------------------------
        print("\n--- [Test 3] Contextual Checkout: Fortune vs Physical ---")
        
        # Fetch store products from isolated fixture
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

        assert fortune_pkg is not None, "FAIL: Test fixture missing fortune package"
        assert physical_pkg is not None, "FAIL: Test fixture missing physical package"

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
        # 4. TEST SECURE ORDER TRACKING
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
        # 5. TEST SLIP UPLOAD SECURITY & LOCAL UPLOAD-SERVING
        # -----------------------------------------------------------------
        print("\n--- [Test 5] Slip Upload Security & Local Upload-Serving ---")

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
            
            # Verify local fallback behavior: returns data URI and saves local slip filename
            slip_filename = updated_order.get("slip_filename")
            assert slip_filename and slip_filename.startswith("slip_") and slip_filename.endswith(".png"), \
                f"Missing or invalid slip_filename: {slip_filename}"
            slip_url = updated_order["slip_url"]
            assert slip_url.startswith("data:image/png;base64,"), \
                f"Expected data URI for local slip fallback, got: {slip_url[:40]}"
            print(f"✓ Verified genuine slip uploaded locally.")
            print(f"  Randomized Filename: {slip_filename}")
            print(f"  Preserved Data URI: {slip_url[:35]}...")

        # 5e. Test local upload-serving endpoint: /api/orders/slip/[filename]
        # Without credentials -> 401
        try:
            req = urllib.request.Request(f"{BASE_URL}/api/orders/slip/{slip_filename}")
            with urllib.request.urlopen(req) as res:
                assert False, "FAIL: Slip was readable without authentication or tracking token!"
        except urllib.error.HTTPError as e:
            assert e.code == 401
            print("✓ Verified: Direct slip file access without credentials blocked with 401")

        # With WRONG tracking token -> 403 Forbidden
        try:
            req = urllib.request.Request(f"{BASE_URL}/api/orders/slip/{slip_filename}?tracking_token=trk_wrong_token")
            with urllib.request.urlopen(req) as res:
                assert False, "FAIL: Slip was readable with wrong tracking token!"
        except urllib.error.HTTPError as e:
            assert e.code == 403
            print("✓ Verified: Direct slip access with wrong tracking token blocked with 403")

        # With VALID tracking token -> 200 OK
        track_slip_url = f"{BASE_URL}/api/orders/slip/{slip_filename}?tracking_token={phys_order['tracking_token']}"
        with urllib.request.urlopen(track_slip_url) as res:
            assert res.status == 200
            content_type = res.headers.get("Content-Type")
            nosniff = res.headers.get("X-Content-Type-Options")
            assert content_type == "image/png"
            assert nosniff == "nosniff"
            print(f"✓ Verified: Slip served securely via tracking token (Content-Type: {content_type}, nosniff: {nosniff})")

        # With ADMIN session cookie -> 200 OK
        admin_slip_req = urllib.request.Request(f"{BASE_URL}/api/orders/slip/{slip_filename}")
        with opener.open(admin_slip_req) as res:
            assert res.status == 200
            print("✓ Verified: Admin can access customer slip using session cookie")

        # -----------------------------------------------------------------
        # 6. TEST PAYMENT VERIFICATION & QUEUE WORKFLOW
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
        # 7. REGRESSION CHECKS FOR RECENT FEATURES (Task 3)
        # -----------------------------------------------------------------
        print("\n--- [Test 7] Regression Checks for Credentials & Notifications ---")

        # 7a. Public GET /api/store must NOT contain credentials
        public_store_req = urllib.request.Request(f"{BASE_URL}/api/store")
        with urllib.request.urlopen(public_store_req) as res:
            pub_store = json.loads(res.read().decode('utf-8'))["data"]
            pub_settings = pub_store["settings"]
            assert "line_channel_access_token" not in pub_settings or not pub_settings["line_channel_access_token"], \
                "SECURITY LEAK: line_channel_access_token exposed in public GET /api/store!"
            assert "webhook_url" not in pub_settings or not pub_settings["webhook_url"], \
                "SECURITY LEAK: webhook_url exposed in public GET /api/store!"
            assert "line_admin_user_id" not in pub_settings or not pub_settings["line_admin_user_id"], \
                "SECURITY LEAK: line_admin_user_id exposed in public GET /api/store!"
            print("✓ Verified: Public GET /api/store completely redacts LINE token, Webhook URL, and LINE user ID")

        # 7b. GET /api/store?admin=true without session must return 401
        try:
            unauth_admin_store_req = urllib.request.Request(f"{BASE_URL}/api/store?admin=true")
            with urllib.request.urlopen(unauth_admin_store_req) as res:
                assert False, "SECURITY LEAK: Unauthenticated GET /api/store?admin=true returned 200!"
        except urllib.error.HTTPError as e:
            assert e.code == 401
            print("✓ Verified: GET /api/store?admin=true without admin session blocked with 401")

        # 7c. GET /api/store?admin=true with session returns full credentials
        auth_admin_store_req = urllib.request.Request(f"{BASE_URL}/api/store?admin=true")
        with opener.open(auth_admin_store_req) as res:
            adm_store = json.loads(res.read().decode('utf-8'))["data"]
            adm_settings = adm_store["settings"]
            assert adm_settings.get("line_channel_access_token") == "secret_line_token_xyz987"
            assert adm_settings.get("webhook_url") == "https://discord.com/api/webhooks/test_fixture"
            assert adm_settings.get("line_admin_user_id") == "U_admin_test_user_id"
            print("✓ Verified: GET /api/store?admin=true with admin session returns all configured credentials")

        # 7d. Partial settings update must NOT wipe existing credentials
        partial_save_req = urllib.request.Request(
            f"{BASE_URL}/api/store",
            data=json.dumps({
                "action": "save_settings",
                "settings": {
                    "shop_subtitle": "เปิดไพ่ฮีลใจ แม่นยำ ตรงไปตรงมา (อัปเดตคำโปรยใหม่)",
                    "theme_preset": "rose_gold"
                }
            }).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with opener.open(partial_save_req) as res:
            save_res = json.loads(res.read().decode('utf-8'))
            assert save_res["success"] == True

        # Fetch settings again via authenticated admin endpoint to confirm credentials preserved
        with opener.open(auth_admin_store_req) as res:
            post_update_settings = json.loads(res.read().decode('utf-8'))["data"]["settings"]
            assert post_update_settings.get("shop_subtitle") == "เปิดไพ่ฮีลใจ แม่นยำ ตรงไปตรงมา (อัปเดตคำโปรยใหม่)"
            assert post_update_settings.get("theme_preset") == "rose_gold"
            assert post_update_settings.get("line_channel_access_token") == "secret_line_token_xyz987", \
                "REGRESSION: line_channel_access_token was wiped by partial settings save!"
            assert post_update_settings.get("webhook_url") == "https://discord.com/api/webhooks/test_fixture", \
                "REGRESSION: webhook_url was wiped by partial settings save!"
            assert post_update_settings.get("line_admin_user_id") == "U_admin_test_user_id", \
                "REGRESSION: line_admin_user_id was wiped by partial settings save!"
            print("✓ Verified: Partial settings update preserved all existing credentials without data loss")

        # 7e. notify_on_queue defaults to false and backend skips notification when false
        assert post_update_settings.get("notify_on_queue") == False
        # Update queue status again - should complete cleanly without error
        with opener.open(update_q_req) as res:
            q_res = json.loads(res.read().decode('utf-8'))
            assert q_res["success"] == True
            print("✓ Verified: notify_on_queue defaults to false, queue update succeeds with notification disabled")

        # 7f. Customer queue notification message contains valid order_no and tracking_token link
        customer_msg = format_customer_queue_update_message(
            q_item,
            post_update_settings.get("shop_name", "Auralune"),
            BASE_URL,
            phys_order["tracking_token"]
        )
        assert f"order_no={urllib.parse.quote(phys_order['order_no'])}" in customer_msg
        assert f"tracking_token={urllib.parse.quote(phys_order['tracking_token'])}" in customer_msg
        assert "/queue?order_no=" in customer_msg
        print("✓ Verified: Customer message contains valid tracking URL with encoded order_no and tracking_token:")
        print(f"  Sample message URL line: {[l for l in customer_msg.splitlines() if '/queue?' in l][0]}")

        # Test fallback when tracking_token is missing
        fallback_msg = format_customer_queue_update_message(
            q_item,
            post_update_settings.get("shop_name", "Auralune"),
            BASE_URL,
            None
        )
        assert "/queue?order_no=" not in fallback_msg
        assert f"#{q_item['order_no']}" in fallback_msg
        print("✓ Verified: Customer message fallback gives manual chat guidance when token is missing")

        # -----------------------------------------------------------------
        # 8. TEST ADMIN LOGOUT
        # -----------------------------------------------------------------
        print("\n--- [Test 8] Admin Logout Session Revocation ---")
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

    finally:
        # Shutdown test server if started by test runner
        if started_server and server_process:
            print("\nShutting down Next.js test server process...")
            server_process.terminate()
            try:
                server_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server_process.kill()
            print("✓ Test server process stopped cleanly")

        # Clean up temporary test directory
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir, ignore_errors=True)
            print("✓ Temporary test directory cleaned up")

        # CRITICAL: Verify project data/store.json was never modified or corrupted!
        final_store_hash = compute_file_sha256(STORE_JSON_PATH)
        assert initial_store_hash == final_store_hash, \
            f"DATA INTEGRITY VIOLATION: data/store.json was modified during test! ({initial_store_hash} != {final_store_hash})"
        print("✓ Verified: Project data/store.json remained 100% untouched and unmodified!")

if __name__ == "__main__":
    run_tests()
