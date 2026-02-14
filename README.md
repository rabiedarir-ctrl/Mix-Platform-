# Mix-Platform-
منصة متعددة تخصصات مثل ترفيه ، تجارة ، تعليم 
Mix_Final/
│
├── README.md                     # مقدمة + طريقة التشغيل + معلومات المستودع
├── LICENSE                       # رخصة الاستخدام (MIT / Apache 2.0)
├── .gitignore                     # ملفات لتجاهل Git
├── mix.config.json               # ملف الذاكرة المركزي (Core Memory)
│
├── backend/                       # الخادم (Python + API + Modules)
│   ├── app.py                     # نقطة تشغيل Backend
│   ├── requirements.txt           # المكتبات المطلوبة
│   ├── core/
│   │   ├── __init__.py
│   │   ├── memory.py              # تحميل mix.config.json
│   │   ├── auth.py                # التحقق من رمز الدخول
│   │   ├── self_heal.py           # إصلاح تلقائي للأخطاء
│   │   └── logger.py              # تسجيل الأخطاء والأنشطة
│   │
│   ├── modules/
│   │   ├── gps/
│   │   │   ├── __init__.py
│   │   │   ├── gps_manager.py     # تحديث المواقع وقراءة الإحداثيات
│   │   │   ├── consent_manager.py # إدارة الموافقات
│   │   │   ├── geofence.py        # المناطق الآمنة وتنبيهات الخروج
│   │   │   └── emergency.py       # زر SOS وحالات الطوارئ
│   │   │
│   │   ├── wallet/
│   │   │   ├── __init__.py
│   │   │   └── wallet_manager.py  # خصم رسوم الخدمات وإدارة المحافظ
│   │   │
│   │   └── ai/
│   │       ├── __init__.py
│   │       ├── ai_logic.py        # الذكاء والتحليل
│   │       └── ai_alerts.py       # تنبيهات ذكية
│   │
│   └── api/
│       ├── __init__.py
│       ├── health.py               # فحص المنصة
│       └── upload.py               # رفع وverify
│
├── frontend/                       # واجهة المستخدم (PWA)
│   ├── index.html
│   ├── manifest.json
│   ├── service-worker.js
│   ├── static/
│   │   ├── main.js
│   │   └── style.css
│   └── package.json                # لإدارة Node.js frontend (اختياري)
│
├── mobile/                         # نسخة APK أو Android
│   └── android/
│       ├── app/
│       │   ├── MainActivity.java
│       │   └── assets/
│       │       └── index.html      # نسخة frontend للاندرويد
│       └── build.gradle
│
├── metaverse/                      # العالم الافتراضي
│   ├── index.html
│   ├── world.js                    # Three.js + Avatar + AI Emotions
│   ├── physics/                    # محاكاة الحركة
│   ├── assets/                     # 3D Models + Textures
│   └── emotions/                   # AI Emotions Simulation
│
├── matrix/                          # نظام الماتريكس
│   ├── core/
│   ├── signals/
│   └── ai_logic/
│
├── data_central/                    # ملف البيانات المركزي
│   ├── MixMatrix_Data_Prototype.json
│   └── README.md
│
├── scripts/                         # أدوات الصيانة + Auto-Fix
│   ├── start.sh                     # تشغيل تلقائي Backend + Frontend
│   ├── check.sh                     # فحص الهيكل قبل الرفع
│   └── sync_external.py             # ربط مستودعات أخرى / تحديث
│
├── storage/                          # للعمل على الهاتف
│   ├── data.json
│   ├── logs/
│   └── cache/
│
└── logs/
    └── system.log 
{
  "platform": "Mix",
  "version": "1.0.0",
  "device_mode": "mobile",                     // وضع التشغيل على الهاتف
  "entry_code": "MIX-001",                     // رمز دخول خاص للتحقق من الهوية
  "storage_path": "/storage/emulated/0/Mix/storage", // مسار الملفات على الهاتف
  "self_heal": true,                           // تمكين الإصلاح التلقائي للأخطاء
  "logging": {                                 // إعدادات التسجيل
    "enabled": true,
    "level": "INFO",
    "file": "/storage/emulated/0/Mix/logs/system.log"
  },
  "modules": {                                 // الوحدات النشطة
    "gps": true,                               // نظام GPS للتتبع والمواقع
    "wallet": true,                            // نظام المحافظ الرقمية والمدفوعات
    "ai": true,                                // الذكاء والتحليل
    "metaverse": true,                         // العالم الافتراضي
    "matrix": true                             // نظام الماتريكس
  },
  "network": {                                 // إعدادات الشبكة
    "online": true,
    "api_endpoint": "http://localhost:5000",  // رابط Backend المحلي
    "update_interval_sec": 300                 // تحديث البيانات كل 5 دقائق
  },
  "consent": {                                 // إعدادات الموافقات
    "required": true,
    "default_duration_hours": 24
  },
  "features": {                                // ميزات إضافية
    "geofence_alert": true,                    // تنبيه عند الخروج من منطقة محددة
    "sos_button": true,                        // زر الطوارئ SOS
    "offline_cache": true                       // تخزين مؤقت في حالة عدم وجود اتصال
  },
  "backup": {                                  // إعدادات النسخ الاحتياطي
    "enabled": true,
    "backup_path": "/storage/emulated/0/Mix/backup",
    "frequency_hours": 24
  },
  "security": {                                // إعدادات الأمان
    "encryption": true,
    "token_expiry_minutes": 60
  }
}
from flask import Flask, request, abort, jsonify
import os
import sys
import json

# ---------------------------
# Helper Modules (Core)
# ---------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# تحميل mix.config.json
def load_memory():
    try:
        with open(os.path.join(BASE_DIR, "mix.config.json"), "r") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading mix.config.json: {e}")
        sys.exit(1)

# التحقق من رمز الدخول
def check_entry(code):
    header_code = request.headers.get("X-MIX-CODE")
    if header_code != code:
        abort(403, description="Forbidden: Invalid Entry Code")

# إصلاح تلقائي (self_heal) - مثال أساسي
def auto_fix(error):
    return {"status": "fixed", "error": str(error)}

# ---------------------------
# Initialize Flask App
# ---------------------------
app = Flask(__name__)
config = load_memory()

# ---------------------------
# Before Request: Entry Check
# ---------------------------
@app.before_request
def gate():
    check_entry(config.get("entry_code", ""))

# ---------------------------
# Health Check API
# ---------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Mix Platform Alive", "version": config.get("version", "1.0.0")})

# ---------------------------
# Example: GPS Update Endpoint
# ---------------------------
@app.route("/api/gps/update", methods=["POST"])
def update_gps():
    if not config["modules"].get("gps", False):
        return jsonify({"status": "GPS module disabled"}), 403
    data = request.json
    device_id = data.get("device_id")
    lat = data.get("lat")
    lng = data.get("lng")
    if not device_id or lat is None or lng is None:
        return jsonify({"error": "Missing parameters"}), 400
    # هنا يمكنك حفظ البيانات في storage/data.json لاحقًا
    return jsonify({"status": "GPS Updated", "device": device_id, "lat": lat, "lng": lng})

# ---------------------------
# Example: Wallet Charge Endpoint
# ---------------------------
@app.route("/api/wallet/charge", methods=["POST"])
def wallet_charge():
    if not config["modules"].get("wallet", False):
        return jsonify({"status": "Wallet module disabled"}), 403
    data = request.json
    user_id = data.get("user_id")
    amount = data.get("amount")
    if not user_id or amount is None:
        return jsonify({"error": "Missing parameters"}), 400
    # هنا يمكن ربط logic لسحب من محفظة المستخدم
    return jsonify({"status": "Charged", "user_id": user_id, "amount": amount})

# ---------------------------
# Example: AI Endpoint
# ---------------------------
@app.route("/api/ai/analyze", methods=["POST"])
def ai_analyze():
    if not config["modules"].get("ai", False):
        return jsonify({"status": "AI module disabled"}), 403
    data = request.json
    text = data.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    # مثال تحليل بسيط
    sentiment = "positive" if "good" in text.lower() else "neutral"
    return jsonify({"text": text, "sentiment": sentiment})

# ---------------------------
# Run Server
# ---------------------------
if __name__ == "__main__":
    host = "0.0.0.0"
    port = int(os.environ.get("PORT", 5000))
    print(f" Starting Mix Platform backend on {host}:{port}")
    app.run(host=host, port=port)
import json
import os
import sys

# ---------------------------
# مسار Base للمنصة
# ---------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ---------------------------
# تحميل الذاكرة المركزية (mix.config.json)
# ---------------------------
def load_memory():
    config_path = os.path.join(BASE_DIR, "mix.config.json")
    if not os.path.exists(config_path):
        print(f" mix.config.json not found at {config_path}")
        sys.exit(1)
    try:
        with open(config_path, "r") as f:
            config = json.load(f)
        return config
    except json.JSONDecodeError as e:
        print(f" Error parsing mix.config.json: {e}")
        sys.exit(1)

# ---------------------------
# حفظ بيانات مؤقتة أو تحديثات المنصة
# ---------------------------
def save_memory(data, filename="data.json"):
    storage_path = load_memory().get("storage_path", "/tmp/Mix/storage")
    if not os.path.exists(storage_path):
        os.makedirs(storage_path)
    file_path = os.path.join(storage_path, filename)
    try:
        with open(file_path, "w") as f:
            json.dump(data, f, indent=4)
        return True
    except Exception as e:
        print(f" Failed to save memory to {file_path}: {e}")
        return False

# ---------------------------
# التحقق من مسار التخزين وملفات المنصة
# ---------------------------
def verify_storage():
    config = load_memory()
    storage_path = config.get("storage_path", "/tmp/Mix/storage")
    if not os.path.exists(storage_path):
        os.makedirs(storage_path)
    # تحقق من المجلدات الأساسية
    folders = ["logs", "cache", "backup"]
    for folder in folders:
        path = os.path.join(storage_path, folder)
        if not os.path.exists(path):
            os.makedirs(path)
    print(f" Storage verified at {storage_path}")
    return storage_path

# ---------------------------
# إصلاح تلقائي (Self-Heal)
# ---------------------------
def self_heal():
    try:
        storage = verify_storage()
        # يمكن إضافة إجراءات إضافية للفحص والإصلاح
        print(" Self-Heal: storage verified")
        return True
    except Exception as e:
        print(f" Self-Heal failed: {e}")
        return False

# ---------------------------
# مثال قراءة بيانات المستخدم أو GPS
# ---------------------------
def load_data(filename="data.json"):
    storage_path = verify_storage()
    file_path = os.path.join(storage_path, filename)
    if not os.path.exists(file_path):
        return {}
    try:
        with open(file_path, "r") as f:
            return json.load(f)
    except Exception as e:
        print(f" Failed to load {file_path}: {e}")
        return {}
from flask import request, abort

# ---------------------------
# التحقق من رمز الدخول (Entry Code)
# ---------------------------
def check_entry(expected_code):
    """
    تتحقق هذه الدالة من أن أي طلب HTTP يحتوي على Header صحيح
    'X-MIX-CODE' يطابق رمز الدخول في mix.config.json.
    """
    header_code = request.headers.get("X-MIX-CODE")
    
    if not header_code:
        # إذا لم يوجد Header
        abort(401, description="Unauthorized: Missing X-MIX-CODE header")
    
    if header_code != expected_code:
        # إذا كان الرمز غير مطابق
        abort(403, description="Forbidden: Invalid Entry Code")
    
    # إذا كان الرمز صحيح، يتم السماح بالطلب
    return True

# ---------------------------
# مثال لتوسيع التحقق (صلاحيات المستخدم)
# ---------------------------
def check_permission(user_role, allowed_roles):
    """
    تحقق من صلاحيات المستخدم بناءً على دوره.
    user_role: الدور الحالي للمستخدم
    allowed_roles: قائمة بالأدوار المسموح بها
    """
    if user_role not in allowed_roles:
        abort(403, description="Forbidden: Insufficient permissions")
    return True
from flask import jsonify

def health_api(app):
    """
    هذه الدالة تضيف API لفحص صحة المنصة (Health Check)
    يمكن استدعاؤها من app.py مباشرة
    """

    @app.route("/health", methods=["GET"])
    def health():
        """
        API endpoint: /health
        يعيد حالة المنصة ونسخة المنصة
        """
        try:
            response = {
                "status": "Mix Platform Alive",
                "version": "1.0.0",  # يمكن سحب النسخة من mix.config.json لاحقًا
                "modules": {
                    "gps": True,       # مثال: يمكن التعديل حسب mix.config.json
                    "wallet": True,
                    "ai": True
                }
            }
            return jsonify(response)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
#!/bin/bash

# ---------------------------------------
# Mix Platform Startup Script
# ---------------------------------------
# هذا السكربت يقوم بتشغيل المنصة من الهاتف أو أي بيئة Python 3
# يتأكد من الملفات الأساسية ويشغل backend وfrontend تلقائيًا
# ---------------------------------------

echo "🔹 Starting Mix Platform..."

# --- تحقق من الملفات الأساسية ---
FILES=("mix.config.json" "backend/app.py" "frontend/index.html")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo " Found $file"
    else
        echo " Missing $file — please check your Mix repository"
    fi
done

# --- تحقق من Python 3 ---
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo " Python installed: $PYTHON_VERSION"
else
    echo " Python 3 not installed. Please install Python 3.x"
    exit 1
fi

# --- تشغيل backend ---
echo " Launching backend..."
cd backend || exit
python3 app.py &
BACKEND_PID=$!
cd ..

# --- تحقق من PWA frontend ---
if [ -f "frontend/index.html" ]; then
    echo " frontend/index.html exists — ready for PWA"
else
    echo " frontend/index.html missing"
fi

echo " Mix Platform backend is running with PID $BACKEND_PID"
echo " You can now open frontend/index.html in a browser to access Mix Platform"

# --- الانتظار لتجنب خروج السكربت ---
echo "Press Ctrl+C to stop Mix Platform"
wait $BACKEND_PID
#!/bin/bash

# ---------------------------------------
# Mix Platform Pre-Check Script
# ---------------------------------------
# هذا السكربت يقوم بفحص الملفات الأساسية والبيئة
# قبل تشغيل Mix Platform أو رفعه على GitHub
# ---------------------------------------

echo " Checking Mix Platform structure..."

# --- تحقق من وجود الملفات الأساسية ---
FILES=("mix.config.json" "backend/app.py" "frontend/index.html")
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo " Found $file"
    else
        echo " Missing $file — please check your Mix repository"
    fi
done

# --- تحقق من Python 3 ---
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo " Python installed: $PYTHON_VERSION"
else
    echo " Python 3 not installed. Please install Python 3.x"
fi

# --- تحقق من إمكانية استدعاء backend/app.py ---
echo " Testing backend syntax..."
if [ -f "backend/app.py" ]; then
    cd backend || exit
    python3 -m py_compile app.py
    if [ $? -eq 0 ]; then
        echo " app.py syntax OK"
    else
        echo " app.py has syntax errors — fix before running Mix"
    fi
    cd ..
else
    echo "
   backend/app.py not found"
fi

# --- تحقق من وجود frontend/index.html ---
if [ -f "frontend/index.html" ]; then
    echo " frontend/index.html exists — ready for PWA"
else
    echo " frontend/index.html missing"
fi

echo " Mix Platform pre-check completed."
echo "You can now run scripts/start.sh to launch Mix Platform."
