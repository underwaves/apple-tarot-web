import io, sys, json, re
from bs4 import BeautifulSoup

with open('reference_page.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

with open('s3_sample.js', 'r', encoding='utf-8', errors='ignore') as f:
    js = f.read()

out_lines = []

out_lines.append("# MORJENG REFERENCE ANALYSIS REPORT\n")

# 1. Visual & layout design elements
out_lines.append("## 1. Visual & Layout Design Architecture")
out_lines.append("- Container: Mobile-first card frame centered on screen (`max-width: 520px` in `.page`) with double hairline border frame (`body::before`, `body::after`).")
out_lines.append("- Background: Radial gradient with cosmic/nature ambient particles and glowing accents.")
out_lines.append("- Typography: Cormorant Garamond serif for headers/prices + Kanit for clean Thai text.")
out_lines.append("- Button style: High-contrast rounded pill/beveled border (`border-radius: 4px 22px 4px 22px`), vibrant glow on hover/active (`aria-pressed`).")
out_lines.append("- Background music: Floating top-right button `♫` with toggle, audio element `#bgm`.")

# 2. Main Page Elements
out_lines.append("\n## 2. Customer Page Sections & Components")
out_lines.append("### A. Hero Header")
out_lines.append("- Store Banner (`#banImg`) & Avatar (`#avImg`) with circular decorative border")
out_lines.append("- Store Title (h1) with gradient text and drop shadow")
out_lines.append("- Store Subtitle / Tagline (`.sub`)")
out_lines.append("- Action Quick Buttons row:")
out_lines.append("  * 'ดูคิว' (Queue Tracker Modal)")
out_lines.append("  * 'ดูรีวิว' (Reviews / Testimonials Modal)")
out_lines.append("  * 'ติดต่อ' (Store Contact Modal - LINE, IG, etc.)")
out_lines.append("  * 'เข้าสู่ระบบ' (Member login/account)")

out_lines.append("\n### B. Product / Package Listing")
out_lines.append("- Categorized sections (`.cats > .cat`): Each category has a header with icon line divider (`.ch`) and description (`.cd`).")
out_lines.append("- Product Cards (`.pkg`):")
out_lines.append("  * Title (`b`), description (`small`), price (`.pr` with optional discount strikethrough `<s>`).")
out_lines.append("  * Selection toggle: Clicking selects item and updates bottom cart floating bar.")

out_lines.append("\n### C. Sticky Bottom Cart Bar")
out_lines.append("- Fixed bottom bar (`.cartb`): Displays count of selected items (`#cbn`) and total price (`#cbp`).")
out_lines.append("- Clicking opens the Order Flow / Cart Modal.")

out_lines.append("\n### D. Multi-Step Order Flow (Modals)")
out_lines.append("- **Step 1: Cart Modal (`#mc`)**")
out_lines.append("  * Lists selected packages with remove/adjust")
out_lines.append("  * Shows total summary")
out_lines.append("  * Action button: 'ถัดไป · กรอกข้อมูล' (Next: Customer Details)")

out_lines.append("- **Step 2: Customer Information Modal (`#s2`)**")
out_lines.append("  * Customer Name (`#name`)")
out_lines.append("  * Order Notes / Details / Questions (`#q`)")
out_lines.append("  * Contact Channel Selection (`#cs`): Choice of LINE, Instagram, Facebook, Phone number, with handle/username input")
out_lines.append("  * Navigation: Back to cart or 'ถัดไป · ไปหน้าโอนเงิน' (Next: Payment)")

out_lines.append("- **Step 3: Payment Modal (`#s3`)**")
out_lines.append("  * PromptPay QR code dynamically rendered with CRC16 payload generation (`#qr`)")
out_lines.append("  * Transfer amount (`#amt`)")
out_lines.append("  * Account Name / Number (`#who`) with one-click copy button (`#copies`)")
out_lines.append("  * Action button: 'แนบสลิป · ส่งให้ร้าน' (Attach Slip · Send to Shop)")

out_lines.append("- **Step 4: Slip Upload & Submission Modal (`#s4`)**")
out_lines.append("  * Drag-and-drop file upload zone (`#drop`, `#slip`) with live image preview (`#prev`)")
out_lines.append("  * Action button: 'ส่งข้อมูลรับบิล' (Submit Order & Slip)")
out_lines.append("  * Progress & validation messages (`#msg`)")

out_lines.append("- **Step 5: Order Confirmation / Bill Modal (`#done`)**")
out_lines.append("  * Order Number / Code (unique)")
out_lines.append("  * Order summary & customer details")
out_lines.append("  * Quick button to contact shop / send order bill directly via LINE/social")
out_lines.append("  * Direct link to track order in Queue")

out_lines.append("\n### E. Queue Tracker (`#mk`)")
out_lines.append("- Order lookup by Order ID / Customer info")
out_lines.append("- Queue status badge (e.g. 'รอตรวจสลิป', 'รอตรวจคิว', 'กำลังดำเนินงาน', 'เสร็จแล้ว')")
out_lines.append("- Queue number / position")
out_lines.append("- Estimated turnaround / time")
out_lines.append("- Shop note / updates for customer")

out_lines.append("\n### F. Admin Backoffice (`#adm`)")
# Let's inspect the admin sections in JS
admin_matches = re.findall(r'(\b[a-zA-Z0-9_]*adm[a-zA-Z0-9_]*\b)', js, re.IGNORECASE)
out_lines.append("- Admin functions found in code: " + ", ".join(list(set(admin_matches))[:20]))

with open('reference_analysis_report.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(out_lines))

print("Report generated successfully.")
