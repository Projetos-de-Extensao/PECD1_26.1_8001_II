
    const btnLerQr = document.getElementById("btnLerQr");
    const btnPararLeitura = document.getElementById("btnPararLeitura");
    const btnEnviar = document.getElementById("btnEnviar");
    const statusEl = document.getElementById("status");
    const scannerArea = document.getElementById("scannerArea");
    const video = document.getElementById("videoScanner");
    const miniTela = document.getElementById("miniTela");

    const valorNome = document.getElementById("valorNome");
    const valorDia = document.getElementById("valorDia");
    const valorHoras = document.getElementById("valorHoras");

    let stream = null;
    let animationId = null;
    let detector = null;
    let lendo = false;

    function setStatus(msg, tipo = "") {
      statusEl.textContent = msg;
      statusEl.className = "status" + (tipo ? " " + tipo : "");
    }

    function preencherMiniTela(dados) {
      valorNome.textContent = dados.nome || "-";
      valorDia.textContent = dados.dia || "-";
      valorHoras.textContent = dados.horas || "-";
      miniTela.classList.add("ativa");
    }

    function parseQrText(texto) {
      try {
        const json = JSON.parse(texto);
        return {
          nome: json.nome || json.palestra || "",
          dia: json.dia || json.data || "",
          horas: json.horas || json.carga_horaria || ""
        };
      } catch {
        const partes = texto.split("|").map(p => p.trim());
        return {
          nome: partes[0] || "",
          dia: partes[1] || "",
          horas: partes[2] || ""
        };
      }
    }

    async function iniciarLeitura() {
      miniTela.classList.remove("ativa");

      if (!("BarcodeDetector" in window)) {
        setStatus("Seu navegador não suporta leitura nativa. Use Chrome/Edge recente ou adicione biblioteca de QR.", "erro");
        return;
      }

      try {
        detector = new BarcodeDetector({ formats: ["qr_code"] });
      } catch {
        setStatus("Falha ao iniciar detector de QR Code.", "erro");
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });
        video.srcObject = stream;
        scannerArea.classList.add("ativo");
        lendo = true;
        btnPararLeitura.disabled = false;
        setStatus("Câmera ativa. Aponte para o QR Code.", "sucesso");
        loopLeitura();
      } catch {
        setStatus("Não foi possível acessar a câmera.", "erro");
      }
    }

    function pararLeitura() {
      lendo = false;
      btnPararLeitura.disabled = true;
      scannerArea.classList.remove("ativo");

      if (animationId) cancelAnimationFrame(animationId);
      animationId = null;

      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        stream = null;
      }
      video.srcObject = null;
    }

    async function loopLeitura() {
      if (!lendo) return;

      try {
        const codigos = await detector.detect(video);
        if (codigos && codigos.length > 0) {
          const textoQr = codigos[0].rawValue || "";
          const dados = parseQrText(textoQr);

          if (!dados.nome || !dados.dia || !dados.horas) {
            setStatus("QR lido, mas formato inválido. Use: Nome|Dia|Horas", "erro");
          } else {
            preencherMiniTela(dados);
            setStatus("QR Code lido com sucesso.", "sucesso");
            pararLeitura();
            return;
          }
        }
      } catch {
        setStatus("Erro ao ler QR. Tente novamente.", "erro");
      }

      animationId = requestAnimationFrame(loopLeitura);
    }

    btnLerQr.addEventListener("click", iniciarLeitura);
    btnPararLeitura.addEventListener("click", () => {
      pararLeitura();
      setStatus("Leitura interrompida.");
    });

    btnEnviar.addEventListener("click", async () => {
      const payload = {
        nome: valorNome.textContent,
        dia: valorDia.textContent,
        horas: valorHoras.textContent
      };

      if (payload.nome === "-" || payload.dia === "-" || payload.horas === "-") {
        setStatus("Leia um QR válido antes de enviar.", "erro");
        return;
      }

      setStatus("Enviando solicitação...");
      // Substitua por fetch real:
      // await fetch("/solicitacao/interna", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });

      await new Promise(r => setTimeout(r, 800));
      setStatus("Solicitação enviada com sucesso.", "sucesso");
    });