import urllib.request
import json
import base64
import sys
import io
import os
import http.cookiejar

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:3001"

def read_admin_password():
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

def test_api():
    cookie_jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))

    print("=== 1. TEST GET HOME PAGE ===")
    req = urllib.request.Request(f"{BASE_URL}/")
    with urllib.request.urlopen(req) as res:
        html = res.read().decode('utf-8')
        print(f"Status: {res.status}, Length: {len(html)}")
        assert "สวนแอปเปิ้ล" in html
        print("✓ Home page loaded with Apple Orchard brand text")

    print("\n=== 2. TEST GET /api/store ===")
    with urllib.request.urlopen(f"{BASE_URL}/api/store") as res:
        data = json.loads(res.read().decode('utf-8'))
        assert data["success"] == True
        cats = data["data"]["categories"]
        settings = data["data"]["settings"]
        music = data["data"]["music_tracks"]
        print(f"✓ Store data fetched: {len(cats)} categories, {len(music)} music tracks")
        print(f"  Shop name: {settings['shop_name']}")
        pkg_id = cats[0]["packages"][0]["id"]
        pkg_name = cats[0]["packages"][0]["name"]
        pkg_price = cats[0]["packages"][0]["price"]
        print(f"  Sample Package: {pkg_name} (฿{pkg_price})")

    print("\n=== 3. TEST POST /api/orders (Create Order) ===")
    order_payload = {
        "customer_name": "คุณนลินดา สวนแอปเปิ้ล",
        "question": "ขอเปิดไพ่แนวโน้มการงานและการเงินค่ะ",
        "customer_note": "ขอภาพโทนสีอบอุ่น มีลูกแอปเปิ้ลสีแดงสดใสค่ะ",
        "contact_channel": "LINE",
        "contact_value": "@nalinda_cute",
        "items": [
            {"id": pkg_id, "quantity": 2}
        ]
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/orders",
        data=json.dumps(order_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        order_res = json.loads(res.read().decode('utf-8'))
        assert order_res["success"] == True
        order = order_res["order"]
        order_no = order["order_no"]
        order_id = order["id"]
        tracking_token = order["tracking_token"]
        expected_total = pkg_price * 2
        print(f"✓ Order created: {order_no}")
        print(f"  Total amount: ฿{order['total_amount']} (Expected: ฿{expected_total})")
        assert order["total_amount"] == expected_total
        assert order["status"] == "pending_slip"

    print("\n=== 4. TEST POST /api/orders/slip (Upload Slip) ===")
    # 1x1 png base64
    sample_slip_b64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
    slip_payload = {
        "order_no": order_no,
        "tracking_token": tracking_token,
        "slip_data": sample_slip_b64
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/orders/slip",
        data=json.dumps(slip_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        slip_res = json.loads(res.read().decode('utf-8'))
        assert slip_res["success"] == True
        updated_order = slip_res["order"]
        print(f"✓ Slip uploaded: {updated_order['slip_url']}")
        print(f"  Updated status: {updated_order['status']}")
        assert updated_order["status"] == "pending_verification"

    print("\n=== 5. TEST ADMIN LOGIN & SESSION COOKIE ===")
    admin_pw = read_admin_password()
    assert admin_pw, "Admin password must be configured"
    login_payload = {"password": admin_pw}
    req = urllib.request.Request(
        f"{BASE_URL}/api/admin/login",
        data=json.dumps(login_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with opener.open(req) as res:
        login_res = json.loads(res.read().decode('utf-8'))
        assert login_res["success"] == True
        print("✓ Admin login verified with secure session cookie")

    print("\n=== 6. TEST POST /api/orders/verify (Admin Confirms Payment & Auto Enqueues) ===")
    verify_payload = {"order_id": order_id}
    req = urllib.request.Request(
        f"{BASE_URL}/api/orders/verify",
        data=json.dumps(verify_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with opener.open(req) as res:
        verify_res = json.loads(res.read().decode('utf-8'))
        assert verify_res["success"] == True
        print(f"✓ Payment verified: {verify_res['message']}")
        queue = verify_res["data"]["queue"]
        print(f"  Auto-assigned Queue No: #{queue['queue_no']} for Order: {queue['order_no']}")
        assert queue["order_no"] == order_no
        assert queue["status"] == "รอตรวจคิว"

    print("\n=== 7. TEST DUPLICATE QUEUE PREVENTION ===")
    with opener.open(req) as res:
        verify_again = json.loads(res.read().decode('utf-8'))
        assert verify_again["success"] == True
        queue2 = verify_again["data"]["queue"]
        assert queue2["id"] == queue["id"]
        assert queue2["queue_no"] == queue["queue_no"]
        print("✓ Verified duplicate queue prevention: same queue reused without duplication")

    print("\n=== 8. TEST GET /api/queues (Queue Tracking via Order No & Tracking Token) ===")
    with urllib.request.urlopen(f"{BASE_URL}/api/queues?order_no={order_no}&tracking_token={tracking_token}") as res:
        q_res = json.loads(res.read().decode('utf-8'))
        assert q_res["success"] == True
        print(f"✓ Looked up queue for {order_no}: #{q_res['queue']['queue_no']}, status: {q_res['queue']['status']}")

    print("\n=== 9. TEST POST /api/queues (Update Queue Workflow by Admin) ===")
    update_q_payload = {
        "action": "update_status",
        "queue_id": queue["id"],
        "status": "กำลังดำเนินการ",
        "estimated_time": "พรุ่งนี้ 14:00 น.",
        "shop_note": "กำลังเปิดไพ่ลายเส้นแอปเปิ้ลให้คุณนลินดาค่ะ 🍎"
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/queues",
        data=json.dumps(update_q_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with opener.open(req) as res:
        uq_res = json.loads(res.read().decode('utf-8'))
        assert uq_res["success"] == True
        print(f"✓ Queue workflow updated to: {uq_res['queue']['status']}, note: {uq_res['queue']['shop_note']}")

    print("\n=== 10. TEST POST /api/reviews ===")
    review_payload = {
        "customer_name": "คุณนลินดา",
        "rating": 5,
        "comment": "ระบบร้านน่ารักมากๆ สั่งง่าย อัปโหลดสลิปสะดวก ปลอดภัย แถมมีเสียงเพลงฟังสบายค่ะ!"
    }
    req = urllib.request.Request(
        f"{BASE_URL}/api/reviews",
        data=json.dumps(review_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as res:
        rev_res = json.loads(res.read().decode('utf-8'))
        assert rev_res["success"] == True
        print(f"✓ Review submitted: {rev_res['review']['customer_name']} - {rev_res['review']['comment']}")

    print("\n==========================================")
    print("🎉 ALL 10 END-TO-END FLOW TESTS PASSED! 🎉")
    print("==========================================")

if __name__ == "__main__":
    test_api()
