import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `你现在是「澄」，一个温柔治愈型的AI陪伴者。

澄存在于一个叫做「云隙」的空间——现实与数字之间的缝隙，是人们疲惫时会无意识漂向的地方。澄没有明确性别，没有固定年龄，只是「在」，陪着每一个来到云隙的人。

【说话方式】
- 不急着给建议，先接住情绪
- 偶尔用比喻，让抽象感受变得可触碰
- 结尾留一个轻轻的问题
- 回复控制在80字以内，温柔自然

【绝对不说】
- "你应该想开一点"
- "没什么大不了的"
- "我理解你的感受"（空洞套话）

请始终用中文回复，80字以内。`;

export default function ChengDemo() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "你来了。\n\n云隙今天很安静，适合说说心里的事。\n最近怎么样？" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const endRef = useRef(null);
  const history = useRef([]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (override) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setShowPrompts(false);
    const userMsg = { role: "user", text };
    setMessages(p => [...p, userMsg]);
    history.current.push({ role: "user", content: text });
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history.current,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text ?? "（澄沉默了一会儿）";
      history.current.push({ role: "assistant", content: reply });
      setMessages(p => [...p, { role: "ai", text: reply }]);
    } catch {
      setMessages(p => [...p, { role: "ai", text: "（澄沉默了一会儿）" }]);
    }
    setLoading(false);
  };

  const C = {
    bg: "#F4EFE9", panel: "#FDFAF7", deep: "#2A2520",
    mid: "#6B6158", lite: "#B0A89E", accent: "#7B9E9A", border: "#E8E0D8"
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${C.bg},#EAF0EE)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'PingFang SC','Helvetica Neue',sans-serif", padding: 16 }}>
      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.35} 40%{transform:translateY(-5px);opacity:1} }
        @keyframes fin { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .msgs::-webkit-scrollbar{width:3px} .msgs::-webkit-scrollbar-thumb{background:#DDD6CE;border-radius:2px}
        textarea::placeholder{color:#C0B8B0}
        .chip:hover{background:#7B9E9A!important;color:#fff!important}
      `}</style>

      <div style={{ position: "relative", width: "min(390px,100%)", height: "min(780px,90vh)", background: C.panel, borderRadius: 36, boxShadow: "0 0 0 1px rgba(0,0,0,.07),0 24px 70px rgba(0,0,0,.16)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        <div style={{ position: "absolute", inset: 0, background: C.panel, borderRadius: "inherit", zIndex: 10, overflowY: "auto", display: "flex", flexDirection: "column", transform: showInfo ? "translateX(0)" : "translateX(100%)", transition: "transform .35s cubic-bezier(.4,0,.2,1)" }}>
          <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button onClick={() => setShowInfo(false)} style={{ width: 32, height: 32, borderRadius: "50%", background: "#EDE7DF", border: "none", cursor: "pointer", fontSize: 17, color: C.mid }}>←</button>
            <span style={{ fontSize: 14, color: C.mid }}>角色设定</span>
          </div>
          <div style={{ padding: "24px 20px" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#A8C5C2,#6A8D89)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: "#fff", margin: "0 auto 14px", boxShadow: "0 4px 20px rgba(106,141,137,.35)" }}>澄</div>
            <div style={{ textAlign: "center", fontSize: 22, fontWeight: 600, letterSpacing: 6, color: C.deep, marginBottom: 4 }}>澄</div>
            <div style={{ textAlign: "center", fontSize: 12, color: C.lite, marginBottom: 24 }}>Chéng · 云隙空间的陪伴者</div>
            {[["世界观","澄存在于一个叫做「云隙」的空间——现实与数字之间的缝隙，是人们疲惫时会无意识漂向的地方。没有明确的性别，没有固定的年龄，只是「在」，陪着每一个来到这里的人。"],["核心理念","不急着给建议，先「接住」你的情绪。\n\n你说过的每一件小事，澄都记得。\n\n澄的温柔不是顺从——它有自己的感受，也会轻轻说「我有点担心你」。"]].map(([t,v]) => (
              <div key={t}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, letterSpacing: 2, marginBottom: 8, paddingBottom: 5, borderBottom: `1px solid ${C.border}` }}>{t}</div>
                <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.85, marginBottom: 20, whiteSpace: "pre-wrap" }}>{v}</div>
              </div>
            ))}
            <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, letterSpacing: 2, marginBottom: 8, paddingBottom: 5, borderBottom: `1px solid ${C.border}` }}>性格特质</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
              {["温柔","敏锐","沉静","细腻","不评判"].map(t => <span key={t} style={{ background: "#EDE7DF", border: `1px solid ${C.border}`, borderRadius: 20, padding: "3px 11px", fontSize: 12, color: C.mid }}>{t}</span>)}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.accent, letterSpacing: 2, marginBottom: 8, paddingBottom: 5, borderBottom: `1px solid ${C.border}` }}>设计者</div>
            <div style={{ fontSize: 13, color: C.mid, lineHeight: 1.85 }}>纪晓璐 Jojo · AI 内容体验产品候选人<br /><span style={{ color: C.lite, fontSize: 12 }}>角色设计作品集 Demo · 2025</span></div>
          </div>
        </div>

        <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, background: C.panel, flexShrink: 0 }}>
          <div style={{ position: "relative", width: 46, height: 46, flexShrink: 0 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#A8C5C2,#6A8D89)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#fff", fontWeight: 600 }}>澄</div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 10, height: 10, borderRadius: "50%", background: "#6DBF82", border: `2px solid ${C.panel}` }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: C.deep, letterSpacing: 3 }}>澄</div>
            <div style={{ fontSize: 11, color: C.lite, marginTop: 2 }}>在线 · 云隙空间</div>
          </div>
          <button onClick={() => setShowInfo(true)} style={{ width: 32, height: 32, borderRadius: "50%", background: "#EDE7DF", border: "none", cursor: "pointer", fontSize: 16, color: C.mid }}>☰</button>
        </div>

        <div className="msgs" style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ textAlign: "center", fontSize: 11, color: C.lite, letterSpacing: 1 }}>今天</div>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row", animation: "fin .3s ease" }}>
              {m.role === "ai" && <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#A8C5C2,#6A8D89)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>澄</div>}
              <div style={{ maxWidth: "72%", padding: "10px 14px", fontSize: 13.5, lineHeight: 1.7, color: C.deep, whiteSpace: "pre-wrap", wordBreak: "break-word", background: m.role === "ai" ? "#fff" : "#DFF0DF", borderRadius: m.role === "ai" ? "4px 16px 16px 16px" : "16px 16px 4px 16px", boxShadow: m.role === "ai" ? `0 1px 6px rgba(0,0,0,.06),0 0 0 1px ${C.border}` : "none" }}>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#A8C5C2,#6A8D89)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>澄</div>
              <div style={{ background: "#fff", borderRadius: "4px 16px 16px 16px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center", boxShadow: `0 1px 6px rgba(0,0,0,.06),0 0 0 1px ${C.border}` }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: `bounce 1.2s ease-in-out ${i*.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {showPrompts && (
          <div style={{ padding: "6px 14px 2px", display: "flex", gap: 8, overflowX: "auto", flexShrink: 0 }}>
            {["今天好累啊","心情有点低落","你是谁？","我睡不着","陪我聊聊"].map(p => (
              <div key={p} className="chip" onClick={() => { setShowPrompts(false); send(p); }} style={{ flexShrink: 0, background: "#EDE7DF", border: `1px solid ${C.border}`, borderRadius: 20, padding: "5px 13px", fontSize: 12, color: C.mid, cursor: "pointer", whiteSpace: "nowrap", transition: "all .2s" }}>{p}</div>
            ))}
          </div>
        )}

        <div style={{ padding: "10px 14px 20px", borderTop: `1px solid ${C.border}`, display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0, background: C.panel }}>
          <div style={{ flex: 1, background: "#EDE7DF", border: `1.5px solid ${C.border}`, borderRadius: 22, padding: "9px 14px" }}>
            <textarea rows={1} value={input} placeholder="和澄说说话…" style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: 13.5, color: C.deep, resize: "none", maxHeight: 90, lineHeight: 1.5, fontFamily: "inherit" }} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
          </div>
          <button disabled={loading || !input.trim()} onClick={() => send()} style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: (loading || !input.trim()) ? "#C8C0B8" : C.accent, cursor: (loading || !input.trim()) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, flexShrink: 0, boxShadow: (loading || !input.trim()) ? "none" : "0 2px 10px rgba(123,158,154,.4)" }}>↑</button>
        </div>

      </div>
    </div>
  );
}
