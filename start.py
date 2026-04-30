"""
IRONFORGE Launcher
Starts FastAPI backend and optionally the Next.js frontend dev server.
"""

import os
import sys
import subprocess
import argparse
import time
import signal


def main():
    parser = argparse.ArgumentParser(description="Launch IRONFORGE services")
    parser.add_argument("--backend-only", action="store_true",
                        help="Start only the FastAPI backend")
    parser.add_argument("--frontend-only", action="store_true",
                        help="Start only the Next.js frontend")
    parser.add_argument("--backend-port", type=int,
                        default=8000, help="Port for FastAPI backend")
    parser.add_argument("--frontend-port", type=int,
                        default=3000, help="Port for Next.js frontend")
    args = parser.parse_args()

    processes = []

    def signal_handler(sig, frame):
        print("\n[IRONFORGE] Shutting down...")
        for p in processes:
            p.terminate()
            try:
                p.wait(timeout=5)
            except subprocess.TimeoutExpired:
                p.kill()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    if not args.frontend_only:
        print(
            f"[IRONFORGE] Starting FastAPI backend on port {args.backend_port}...")
        backend_cmd = [
            sys.executable, "-m", "uvicorn",
            "webapp.backend.main:app",
            "--host", "0.0.0.0",
            "--port", str(args.backend_port),
            "--reload",
        ]
        env = os.environ.copy()
        env["BACKEND_PORT"] = str(args.backend_port)
        backend_proc = subprocess.Popen(backend_cmd, env=env)
        processes.append(backend_proc)
        time.sleep(2)

    if not args.backend_only:
        print(
            f"[IRONFORGE] Starting Next.js frontend on port {args.frontend_port}...")
        frontend_dir = os.path.join(
            os.path.dirname(__file__), "webapp", "frontend")
        frontend_cmd = ["npm", "run", "dev", "--",
                        "--port", str(args.frontend_port)]
        env = os.environ.copy()
        env["NEXT_PUBLIC_API_URL"] = f"http://localhost:{args.backend_port}"
        frontend_proc = subprocess.Popen(
            frontend_cmd, cwd=frontend_dir, env=env, shell=(sys.platform == "win32"))
        processes.append(frontend_proc)

    print("[IRONFORGE] All services started. Press Ctrl+C to stop.")
    for p in processes:
        p.wait()


if __name__ == "__main__":
    main()
