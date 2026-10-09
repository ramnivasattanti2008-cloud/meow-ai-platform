import subprocess
import time
import sys

print("[MEOW AI Watcher] Monitoring DNS propagation for meowai.tech...")

for attempt in range(1, 120): # Check for up to 30 minutes
    try:
        # Check via Google DoH
        import urllib.request, json
        req = urllib.request.Request('https://dns.google/resolve?name=meowai.tech&type=A', headers={'User-Agent': 'MEOW-AI/1.0'})
        res = urllib.request.urlopen(req, timeout=5)
        data = json.loads(res.read().decode())
        
        status = data.get("Status")
        answers = data.get("Answer", [])
        
        if status == 0 and len(answers) > 0:
            print(f"[Attempt {attempt}] DNS records detected! Answers: {answers}")
            print("[MEOW AI Watcher] Triggering Vercel verification...")
            out = subprocess.run(["npx", "vercel", "domains", "verify", "meowai.tech"], capture_output=True, text=True)
            print(out.stdout)
            print(out.stderr)
            if out.returncode == 0:
                print(">>> SUCCESS! meowai.tech is fully verified and live on Vercel!")
                sys.exit(0)
    except Exception as e:
        pass
    
    time.sleep(15)

print("[MEOW AI Watcher] Watcher timed out. Run 'npx vercel domains verify meowai.tech' whenever ready.")

