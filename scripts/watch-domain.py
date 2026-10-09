import subprocess
import time
import sys
import urllib.request
import json

print("[MEOW AI Watcher] Monitoring DNS propagation for meowboxai.tech...")

for attempt in range(1, 500): # Check for up to ~2 hours
    try:
        # Check NS records
        req_ns = urllib.request.Request('https://dns.google/resolve?name=meowboxai.tech&type=NS', headers={'User-Agent': 'MEOW-AI/1.0'})
        res_ns = urllib.request.urlopen(req_ns, timeout=5)
        data_ns = json.loads(res_ns.read().decode())
        
        # Check A records
        req_a = urllib.request.Request('https://dns.google/resolve?name=meowboxai.tech&type=A', headers={'User-Agent': 'MEOW-AI/1.0'})
        res_a = urllib.request.urlopen(req_a, timeout=5)
        data_a = json.loads(res_a.read().decode())
        
        has_records = (data_ns.get("Status") == 0 and len(data_ns.get("Answer", [])) > 0) or (data_a.get("Status") == 0 and len(data_a.get("Answer", [])) > 0)
        
        print(f"[Attempt {attempt}] Checking verification with Vercel...", flush=True)
        out = subprocess.run(["npx", "vercel", "domains", "verify", "meowboxai.tech"], capture_output=True, text=True, shell=True)
        if out.returncode == 0:
            print(">>> SUCCESS! meowboxai.tech is verified and active on Vercel!", flush=True)
            print(out.stdout, flush=True)
            sys.exit(0)
        else:
            if "invalid_configuration" in out.stdout or "invalid_configuration" in out.stderr:
                print(f"[Attempt {attempt}] Propagation in progress. Retrying in 15s...", flush=True)
    except Exception as e:
        print(f"[Attempt {attempt}] Error checking: {e}", flush=True)
    
    time.sleep(15)

print("[MEOW AI Watcher] Watcher timed out. Run 'npx vercel domains verify meowai.tech' whenever ready.")

