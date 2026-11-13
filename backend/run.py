import os
from app import create_app, socketio

app = create_app(os.getenv("FLASK_ENV", "development"))

if __name__ == "__main__":
    host = app.config.get("HOST", "0.0.0.0")
    port = app.config.get("PORT", 5000)
    debug = app.config.get("DEBUG", True)
    
    print(f"\n========================================================")
    print(f"🚀 WAVY Backend Server starting on http://{host}:{port}")
    print(f"📡 API Health check available at: http://{host}:{port}/api/v1/health")
    print(f"========================================================\n")
    
    socketio.run(app, host=host, port=port, debug=debug, allow_unsafe_werkzeug=True)

