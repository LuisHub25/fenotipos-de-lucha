import { useState, useEffect, useRef } from "react"; 

const QUESTIONS = [
  {
    id: "referente",
    secuencia: "SEC_01",
    gen: "GEN-MEMORIA",
    pregunta: "¿Quién es la mujer que más te ha marcado?",
    placeholder: "su nombre, o cómo la llamas tú…",
    hint: "puede ser tu mamá, abuela, tía, amiga, o alguien que nunca conociste"
  },
  {
    id: "rasgo",
    secuencia: "SEC_02",
    gen: "GEN-FENOTIPO",
    pregunta: "¿Qué rasgo de ella nunca pudieron quitarle?",
    placeholder: "su terquedad, su risa, su silencio que lo decía todo…",
    hint: "el rasgo que la define aunque el mundo intentara borrarlo"
  },
  {
    id: "lucha",
    secuencia: "SEC_03",
    gen: "GEN-RESISTENCIA",
    pregunta: "¿Por qué luchó ella, aunque nunca lo llamara lucha?",
    placeholder: "criar sola, estudiar de noche, no doblegarse…",
    hint: "las batallas silenciosas también son revoluciones"
  },
  {
    id: "herencia",
    secuencia: "SEC_04",
    gen: "GEN-HERENCIA",
    pregunta: "¿Qué de ella vive en ti?",
    placeholder: "su forma de hablar, su manera de resistir…",
    hint: "no solo se heredan rasgos. se heredan historias."
  }
];

// Don Alfaro brand colors
const DA = {
  rojo: "#E8281E",
  amarillo: "#F5C800",
  teal: "#1B5E6E",
  negro: "#1A1A1A",
  arena: "#F5F0E8",
  arena2: "#EDE8E0",
  gris: "#8A8070",
  linea: "#D8D0C0"
};

const DNA_CHARS = "ATCGATCGATCG";

function DNAStream({ active }) {
  const [chars, setChars] = useState([]);
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setChars(prev => {
        const next = [...prev, DNA_CHARS[Math.floor(Math.random() * DNA_CHARS.length)]];
        return next.slice(-80);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div style={{
      fontFamily: "'Courier New', monospace",
      fontSize: "10px",
      color: "#C8C0B0",
      letterSpacing: "2px",
      lineHeight: "1.8",
      wordBreak: "break-all",
      opacity: active ? 1 : 0,
      transition: "opacity 0.5s",
      userSelect: "none"
    }}>
      {chars.join("")}
    </div>
  );
}

function ProgressHelix({ step, total }) {
  const pct = (step / total) * 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{ fontSize: "9px", fontFamily: "'Courier New', monospace", color: "#8A8070", letterSpacing: "2px" }}>
        SECUENCIA {step}/{total}
      </div>
      <div style={{ flex: 1, height: "2px", background: "#E8E0D0", position: "relative" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, height: "100%",
          width: `${pct}%`, background: "#1A1A1A",
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)"
        }} />
      </div>
      <div style={{ fontSize: "9px", fontFamily: "'Courier New', monospace", color: "#8A8070" }}>
        {Math.round(pct)}%
      </div>
    </div>
  );
}

export default function FenotipoDeLucha() {
  const [fase, setFase] = useState("intro"); // intro | secuencia | procesando | resultado
  const [paso, setPaso] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [inputActual, setInputActual] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);
  const [streamingText, setStreamingText] = useState("");
  const [revealed, setRevealed] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (fase === "secuencia" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [fase, paso]);

  useEffect(() => {
    if (fase === "resultado" && resultado) {
      setTimeout(() => setRevealed(true), 200);
    }
  }, [fase, resultado]);

  const avanzar = () => {
    if (!inputActual.trim()) return;
    const q = QUESTIONS[paso];
    const nuevasRespuestas = { ...respuestas, [q.id]: inputActual.trim() };
    setRespuestas(nuevasRespuestas);
    setInputActual("");

    if (paso < QUESTIONS.length - 1) {
      setPaso(paso + 1);
    } else {
      setFase("procesando");
      procesarSecuencia(nuevasRespuestas);
    }
  };

  const procesarSecuencia = async (datos) => {
    try {
      const prompt = `Eres el motor creativo de "Fenotipos de Lucha", un proyecto del 8M de la agencia Don Alfaro (Ecuador). 
      
Una mujer acaba de responder 4 preguntas sobre su referente femenino más importante. Tu tarea es sintetizar su historia en tres elementos poéticos y precisos.

Datos de la mujer:
- Referente: ${datos.referente}
- Rasgo que nunca le pudieron quitar: ${datos.rasgo}
- Por qué luchó (sin llamarlo lucha): ${datos.lucha}  
- Qué vive en ella hoy: ${datos.herencia}

Responde SOLO con un JSON válido, sin backticks, sin markdown, exactamente así:

{
  "fenotipo": "2-4 palabras que nombran SU herencia única, poético, en minúsculas. Ej: 'silencio que no cede', 'raíz que no se ve'",
  "frase": "Una sola frase de impacto de máximo 12 palabras que conecte a la referente con quien la hereda. Debe sentirse como un hallazgo, no como un slogan.",
  "prompt_imagen": "Split genetic portrait created from two reference photos. Left side uses the first reference face (the guerrera — grandmother, mother, or female referent). Right side uses the second reference face (the person completing this exercise). Perfect vertical split down the center of the face. Align eyes, nose bridge, mouth, chin, jawline, hairline and forehead height exactly. Both halves must share the same skull structure. Do not reinterpret identities, do not modify facial anatomy, preserve skin texture and real identity. Simulate portrait photography with an 85mm lens. Soft studio lighting, neutral white background, even illumination on both halves, no shadows crossing the split line. Then: remove the visible vertical division — blend the skin texture subtly only along the center transition so the portrait appears as one continuous human face. Slightly equalize skin tone for a natural transition. Both sides must remain recognizable as two different individuals. Final output must feel like an analog studio photograph, not a digital composite. Add subtle film grain. Avoid AI-generated smoothness or skin retouching. Ultra high detail, 2048x3072 resolution.",
  "historia": "Dos párrafos cortos (máximo 60 palabras en total) que cuenten la historia de esta herencia. Tono: íntimo, directo, sin adornos. Primera persona de quien hereda."
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
       "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResultado(parsed);
      setFase("resultado");
    } catch (e) {
      setError("Error en la secuenciación. Intenta de nuevo.");
      setFase("secuencia");
      setPaso(QUESTIONS.length - 1);
    }
  };

  const reiniciar = () => {
    setFase("intro");
    setPaso(0);
    setRespuestas({});
    setInputActual("");
    setResultado(null);
    setError(null);
    setRevealed(false);
  };

  const preguntaActual = QUESTIONS[paso];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F5F0E8",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Georgia', serif",
      color: "#1A1A1A"
    }}>
      {/* Header — Rams: functional, no decoration */}
      <header style={{
        padding: "24px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: "1px solid #D8D0C0"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            background: DA.rojo, color: "#fff",
            fontFamily: "'Courier New', monospace",
            fontSize: "11px", letterSpacing: "3px",
            padding: "6px 12px", fontWeight: "700"
          }}>
            8M
          </div>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", fontFamily: "'Courier New', monospace", color: DA.gris, marginBottom: "4px" }}>
              DON ALFARO × 2026
            </div>
            <div style={{ fontSize: "18px", fontWeight: "400", letterSpacing: "1px", color: DA.negro }}>
              Fenotipos de Lucha
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "'Courier New', monospace", color: DA.gris }}>
            LA REVOLUCIÓN NO
          </div>
          <div style={{ fontSize: "9px", letterSpacing: "3px", fontFamily: "'Courier New', monospace", color: DA.teal, fontWeight: "700" }}>
            EMPIEZA CONMIGO
          </div>
        </div>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>

        {/* INTRO */}
        {fase === "intro" && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "center", padding: "48px 32px",
            maxWidth: "600px", margin: "0 auto", width: "100%"
          }}>
            <div style={{
              fontSize: "9px", letterSpacing: "4px", fontFamily: "'Courier New', monospace",
              color: DA.gris, marginBottom: "32px"
            }}>
              PROTOCOLO DE SECUENCIACIÓN GENÉTICA
            </div>

            <h1 style={{
              fontSize: "clamp(32px, 6vw, 52px)", fontWeight: "400",
              lineHeight: "1.15", margin: "0 0 32px 0", letterSpacing: "-0.5px"
            }}>
              No solo se<br />heredan rasgos.<br />
              <em style={{ fontStyle: "italic", color: DA.teal }}>Se heredan historias.</em>
            </h1>

            <p style={{
              fontSize: "14px", lineHeight: "1.8", color: "#5A5040",
              margin: "0 0 48px 0", maxWidth: "440px"
            }}>
              4 preguntas. Una secuencia. El fenotipo de lucha que llevas en ti — 
              y el prompt para hacerlo visible.
            </p>

            <div style={{
              borderLeft: `2px solid ${DA.rojo}`, paddingLeft: "20px",
              marginBottom: "48px"
            }}>
              {["A·T", "C·G", "G·C", "T·A"].map((par, i) => (
                <div key={i} style={{
                  fontSize: "10px", fontFamily: "'Courier New', monospace",
                  color: i % 2 === 0 ? DA.teal : DA.gris, letterSpacing: "4px", lineHeight: "2"
                }}>
                  {par} — {["MEMORIA", "RESISTENCIA", "HERENCIA", "CONTINUIDAD"][i]}
                </div>
              ))}
            </div>

            <button
              onClick={() => setFase("secuencia")}
              style={{
                background: DA.rojo, color: "#fff",
                border: "none", padding: "16px 32px",
                fontSize: "11px", letterSpacing: "4px",
                fontFamily: "'Courier New', monospace",
                cursor: "pointer", alignSelf: "flex-start",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.target.style.background = DA.teal}
              onMouseLeave={e => e.target.style.background = DA.rojo}
            >
              INICIAR SECUENCIACIÓN →
            </button>
          </div>
        )}

        {/* SECUENCIA */}
        {fase === "secuencia" && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            padding: "40px 32px", maxWidth: "600px",
            margin: "0 auto", width: "100%", gap: "32px"
          }}>
            <ProgressHelix step={paso + 1} total={QUESTIONS.length} />

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "8px"
            }}>
              {QUESTIONS.map((q, i) => (
                <div key={i} style={{
                  height: "2px",
                  background: i <= paso ? DA.rojo : "#D8D0C0",
                  transition: "background 0.4s"
                }} />
              ))}
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px" }}>
              <div>
                <div style={{
                  fontSize: "9px", letterSpacing: "4px",
                  fontFamily: "'Courier New', monospace", color: "#8A8070", marginBottom: "8px"
                }}>
                  {preguntaActual.secuencia} / {preguntaActual.gen}
                </div>
                <h2 style={{
                  fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "400",
                  lineHeight: "1.3", margin: 0, letterSpacing: "-0.3px"
                }}>
                  {preguntaActual.pregunta}
                </h2>
              </div>

              <p style={{
                fontSize: "12px", color: "#8A8070", margin: 0,
                fontFamily: "'Courier New', monospace", letterSpacing: "1px"
              }}>
                ↳ {preguntaActual.hint}
              </p>

              <div style={{ position: "relative" }}>
                <textarea
                  ref={inputRef}
                  value={inputActual}
                  onChange={e => setInputActual(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      avanzar();
                    }
                  }}
                  placeholder={preguntaActual.placeholder}
                  rows={3}
                  style={{
                    width: "100%", background: "transparent",
                    border: "none", borderBottom: "1px solid #C8C0B0",
                    padding: "12px 0", fontSize: "16px", fontFamily: "'Georgia', serif",
                    color: "#1A1A1A", resize: "none", outline: "none",
                    lineHeight: "1.6", boxSizing: "border-box",
                    caretColor: "#1A1A1A"
                  }}
                />
                <div style={{
                  position: "absolute", bottom: "4px", right: "0",
                  fontSize: "9px", color: "#C8C0B0",
                  fontFamily: "'Courier New', monospace", letterSpacing: "2px"
                }}>
                  ENTER →
                </div>
              </div>

              {error && (
                <div style={{ fontSize: "11px", color: "#8A3020", fontFamily: "'Courier New', monospace" }}>
                  ⚠ {error}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {paso > 0 && (
                  <button
                    onClick={() => { setPaso(paso - 1); setInputActual(""); }}
                    style={{
                      background: "transparent", border: "none",
                      fontSize: "10px", letterSpacing: "3px", color: "#8A8070",
                      fontFamily: "'Courier New', monospace", cursor: "pointer", padding: 0
                    }}
                  >
                    ← ANTERIOR
                  </button>
                )}
                <div style={{ flex: 1 }} />
                <button
                  onClick={avanzar}
                  disabled={!inputActual.trim()}
                  style={{
                    background: inputActual.trim() ? DA.teal : "#D8D0C0",
                    color: "#F5F0E8", border: "none",
                    padding: "12px 24px", fontSize: "10px",
                    letterSpacing: "3px", fontFamily: "'Courier New', monospace",
                    cursor: inputActual.trim() ? "pointer" : "default",
                    transition: "background 0.2s"
                  }}
                >
                  {paso < QUESTIONS.length - 1 ? "SIGUIENTE" : "SECUENCIAR"} →
                </button>
              </div>
            </div>

            <DNAStream active={true} />
          </div>
        )}

        {/* PROCESANDO */}
        {fase === "procesando" && (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            padding: "48px 32px", gap: "32px"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                fontSize: "9px", letterSpacing: "5px",
                fontFamily: "'Courier New', monospace", color: "#8A8070", marginBottom: "24px"
              }}>
                ANALIZANDO SECUENCIA GENÉTICA
              </div>
              <HelixLoader />
            </div>
            <DNAStream active={true} />
            <div style={{
              fontSize: "10px", letterSpacing: "3px",
              fontFamily: "'Courier New', monospace", color: "#8A8070", textAlign: "center"
            }}>
              construyendo tu fenotipo de lucha…
            </div>
          </div>
        )}

        {/* RESULTADO */}
        {fase === "resultado" && resultado && (
          <div style={{
            flex: 1, padding: "40px 32px",
            maxWidth: "680px", margin: "0 auto", width: "100%"
          }}>
            {/* Fenotipo — la pieza principal */}
            <div style={{
              marginBottom: "48px",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.8s, transform 0.8s"
            }}>
              <div style={{
                fontSize: "9px", letterSpacing: "4px",
                fontFamily: "'Courier New', monospace", color: DA.gris, marginBottom: "12px"
              }}>
                FENOTIPO IDENTIFICADO
              </div>
              <div style={{
                fontSize: "clamp(28px, 7vw, 52px)", fontWeight: "400",
                letterSpacing: "-1px", lineHeight: "1.1",
                fontStyle: "italic", color: DA.teal, marginBottom: "16px"
              }}>
                {resultado.fenotipo}
              </div>
              <div style={{ height: "2px", background: DA.rojo, marginBottom: "20px", width: "48px" }} />
              <div style={{
                fontSize: "17px", lineHeight: "1.6", color: "#3A3020",
                fontWeight: "400", fontStyle: "normal"
              }}>
                {resultado.frase}
              </div>
            </div>

            {/* Historia */}
            <div style={{
              marginBottom: "40px",
              opacity: revealed ? 1 : 0,
              transform: revealed ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.8s 0.2s, transform 0.8s 0.2s"
            }}>
              <div style={{
                fontSize: "9px", letterSpacing: "4px",
                fontFamily: "'Courier New', monospace", color: DA.gris, marginBottom: "16px"
              }}>
                TU GEN DE LUCHA
              </div>
              <p style={{
                fontSize: "14px", lineHeight: "1.9", color: "#4A4030",
                margin: 0, borderLeft: `2px solid ${DA.amarillo}`, paddingLeft: "20px"
              }}>
                {resultado.historia}
              </p>
            </div>

            {/* Prompt */}
            <div style={{
              marginBottom: "0px",
              opacity: revealed ? 1 : 0,
              transition: "opacity 0.8s 0.4s"
            }}>
              <div style={{
                fontSize: "9px", letterSpacing: "4px",
                fontFamily: "'Courier New', monospace", color: DA.gris, marginBottom: "12px"
              }}>
                PROMPT PARA TU FENOTIPO DE LUCHA
              </div>
              <div style={{
                background: DA.arena2, padding: "20px",
                fontFamily: "'Courier New', monospace",
                fontSize: "11px", lineHeight: "1.8", color: "#3A3020",
                letterSpacing: "0.5px", position: "relative"
              }}>
                {resultado.prompt_imagen}
                <button
                  onClick={() => navigator.clipboard?.writeText(resultado.prompt_imagen)}
                  style={{
                    position: "absolute", top: "12px", right: "12px",
                    background: DA.teal, border: "none",
                    fontSize: "8px", letterSpacing: "2px", padding: "4px 10px",
                    fontFamily: "'Courier New', monospace", color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  COPIAR
                </button>
              </div>
              <div style={{
                fontSize: "10px", color: DA.gris,
                fontFamily: "'Courier New', monospace",
                marginTop: "8px", letterSpacing: "1px"
              }}>
                ↳ pega esto en ChatGPT, Midjourney, o Flux junto a una foto tuya y de tu guerrera — y compártela con orgullo
              </div>
            </div>

            {/* CTA Don Alfaro IG — bloque Don Alfaro */}
            <div style={{
              marginTop: "40px",
              background: DA.teal,
              padding: "28px 28px 24px",
              opacity: revealed ? 1 : 0,
              transition: "opacity 0.8s 0.55s"
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px"
              }}>
                <div style={{
                  background: DA.rojo, color: "#fff",
                  fontFamily: "'Courier New', monospace",
                  fontSize: "11px", letterSpacing: "3px",
                  padding: "4px 10px", fontWeight: "700", flexShrink: 0
                }}>
                  8M
                </div>
                <div style={{
                  fontSize: "9px", letterSpacing: "4px",
                  fontFamily: "'Courier New', monospace", color: DA.amarillo
                }}>
                  SIGUIENTE PASO
                </div>
              </div>

              <p style={{
                fontSize: "15px", lineHeight: "1.7", color: "#fff",
                margin: "0 0 20px 0", fontFamily: "'Georgia', serif"
              }}>
                <em style={{ color: DA.amarillo, fontStyle: "italic" }}>O...</em> Envíanos el prompt y las fotos de tu guerrera y la tuya por DM a nuestro Instagram —
                nosotros haremos tu imagen para que la compartas con tu fenotipo de lucha. Todo lo hacemos entre todas.
              </p>

              <a
                href="https://www.instagram.com/ideasdonalfaro/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: DA.amarillo, color: DA.negro,
                  fontFamily: "'Courier New', monospace",
                  fontSize: "11px", letterSpacing: "3px",
                  padding: "12px 24px", textDecoration: "none",
                  fontWeight: "700", transition: "opacity 0.2s"
                }}
              >
                @IDEASDONALFARO →
              </a>

              <div style={{
                marginTop: "16px",
                fontSize: "9px", color: "rgba(255,255,255,0.5)",
                fontFamily: "'Courier New', monospace", letterSpacing: "2px"
              }}>
                #FenotiposDeLucha · #DonAlfaro · #8M2026
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              marginTop: "24px",
              padding: "20px",
              border: `1px solid ${DA.linea}`,
              opacity: revealed ? 1 : 0,
              transition: "opacity 0.8s 0.7s"
            }}>
              <div style={{
                fontSize: "9px", letterSpacing: "3px",
                fontFamily: "'Courier New', monospace", color: DA.gris, marginBottom: "10px"
              }}>
                AUTORIZACIÓN Y USO DE DATOS
              </div>
              <p style={{
                fontSize: "11px", lineHeight: "1.8", color: "#6A6050",
                margin: 0, fontFamily: "'Courier New', monospace"
              }}>
                Al usar esta herramienta aceptas que Don Alfaro puede utilizar las respuestas e imágenes generadas con fines creativos y educativos relacionados con la campaña 8M 2026. Tus datos no serán compartidos con terceros ni utilizados para ningún otro fin. Esta activación tiene un propósito exclusivamente cultural y de concientización. No almacenamos información personal identificable.
              </p>
            </div>

            {/* Nueva secuencia */}
            <div style={{
              marginTop: "32px", marginBottom: "48px",
              opacity: revealed ? 1 : 0,
              transition: "opacity 0.8s 0.8s",
              display: "flex", justifyContent: "flex-end"
            }}>
              <button
                onClick={reiniciar}
                style={{
                  background: "transparent", border: `1px solid ${DA.negro}`,
                  padding: "12px 24px", fontSize: "10px",
                  letterSpacing: "3px", fontFamily: "'Courier New', monospace",
                  color: DA.negro, cursor: "pointer"
                }}
              >
                NUEVA SECUENCIA
              </button>
            </div>

            {/* CIERRE — Puño Genético */}
            <ClosingSplash />
          </div>
        )}
      </main>

      <footer style={{
        padding: "16px 32px",
        borderTop: `1px solid ${DA.linea}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: DA.negro
      }}>
        <div style={{
          fontSize: "9px", letterSpacing: "3px",
          fontFamily: "'Courier New', monospace", color: "rgba(255,255,255,0.4)"
        }}>
          DON ALFARO — REVOLUCIÓN DE IDEAS
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            background: DA.rojo,
            fontSize: "9px", letterSpacing: "3px", padding: "3px 8px",
            fontFamily: "'Courier New', monospace", color: "#fff", fontWeight: "700"
          }}>8M</div>
          <div style={{
            fontSize: "9px", letterSpacing: "2px",
            fontFamily: "'Courier New', monospace", color: DA.amarillo
          }}>
            LA REVOLUCIÓN CONTINÚA EN TI
          </div>
        </div>
      </footer>
    </div>
  );
}

// Closing splash — puño genético sobre fondo arena
function ClosingSplash() {
  const [visible, setVisible] = useState(false);
  const [dnaPhase, setDnaPhase] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setDnaPhase(p => (p + 1) % 100), 60);
    return () => clearInterval(t);
  }, [visible]);

  const dnaStrands = Array.from({ length: 7 }, (_, i) => {
    const x = 55 + i * 28;
    const phase = (dnaPhase + i * 14) % 100;
    const amp = 16;
    const y1 = 55, y2 = 295;
    const points = Array.from({ length: 14 }, (_, j) => {
      const t = j / 13;
      const y = y1 + t * (y2 - y1);
      const wave = Math.sin((t * Math.PI * 3.5) + (phase / 100) * Math.PI * 2) * amp;
      return `${x + wave},${y}`;
    });
    return points.join(" ");
  });

  const crossStrands = Array.from({ length: 7 }, (_, i) => {
    const t = (i + 0.5) / 7;
    const y = 55 + t * 240;
    const phase = (dnaPhase + i * 14) % 100;
    const offset = Math.sin((phase / 100) * Math.PI * 2) * 16;
    return { y, offset };
  });

  return (
    <div
      ref={ref}
      style={{
        margin: "40px -32px 0",
        background: DA.arena,
        borderTop: `3px solid ${DA.rojo}`,
        padding: "64px 32px 56px",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        overflow: "hidden", position: "relative",
        opacity: visible ? 1 : 0,
        transition: "opacity 1.2s 0.2s"
      }}
    >
      {/* SVG — DNA + fist */}
      <svg
        viewBox="40 44 250 268"
        width="240" height="240"
        style={{ marginBottom: "4px" }}
      >
        {dnaStrands.map((pts, i) => (
          <polyline
            key={i}
            points={pts}
            fill="none"
            stroke={i % 2 === 0 ? `rgba(27,94,110,0.4)` : `rgba(232,40,30,0.3)`}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
        {crossStrands.map((s, i) => (
          <line
            key={i}
            x1={55 + s.offset} y1={s.y}
            x2={223 - s.offset} y2={s.y}
            stroke="rgba(27,94,110,0.25)"
            strokeWidth="1"
            strokeDasharray="3 4"
          />
        ))}
        {["A", "T", "C", "G", "A", "T", "C"].map((base, i) => (
          <text
            key={i}
            x={i % 2 === 0 ? 44 : 222}
            y={72 + i * 30}
            fontSize="7"
            fill={`rgba(232,40,30,0.5)`}
            fontFamily="'Courier New', monospace"
          >{base}</text>
        ))}
      </svg>

      {/* 8M */}
      <div style={{
        fontSize: "clamp(80px, 20vw, 128px)",
        fontFamily: "'Georgia', serif",
        fontWeight: "400",
        color: DA.rojo,
        lineHeight: "0.9",
        letterSpacing: "-4px",
        marginBottom: "12px",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.9s 0.5s, transform 0.9s 0.5s"
      }}>
        8M
      </div>

      {/* Fenotipos de Lucha */}
      <div style={{
        fontSize: "clamp(20px, 4.5vw, 30px)",
        fontFamily: "'Georgia', serif",
        fontStyle: "italic",
        color: DA.teal,
        letterSpacing: "0px",
        marginBottom: "14px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.9s 0.8s"
      }}>
        Fenotipos de Lucha
      </div>

      {/* Divider */}
      <div style={{
        width: "40px", height: "2px",
        background: DA.amarillo,
        marginBottom: "14px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.9s 1s"
      }} />

      {/* Don Alfaro */}
      <div style={{
        fontSize: "11px",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "6px",
        color: DA.negro,
        opacity: visible ? 0.5 : 0,
        transition: "opacity 0.9s 1.1s"
      }}>
        DON ALFARO
      </div>

      {/* Tagline */}
      <div style={{
        marginTop: "28px",
        fontSize: "9px",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "4px",
        color: DA.rojo,
        opacity: visible ? 0.7 : 0,
        transition: "opacity 0.9s 1.3s"
      }}>
        LA REVOLUCIÓN CONTINÚA EN TI
      </div>
    </div>
  );
}

// Helix loader — genética hecha animación
function HelixLoader() {
  const points = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center", justifyContent: "center" }}>
      {points.map(i => (
        <div key={i} style={{
          width: "3px",
          background: i % 3 === 0 ? DA.rojo : i % 3 === 1 ? DA.teal : DA.amarillo,
          borderRadius: "1px",
          animation: `helix ${0.8 + (i % 3) * 0.15}s ease-in-out ${i * 0.08}s infinite alternate`,
        }} />
      ))}
      <style>{`
        @keyframes helix {
          from { height: 4px; opacity: 0.2; }
          to { height: 28px; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
