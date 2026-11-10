const resposta = document.querySelector("#resposta");
const lista = document.querySelector("#lista-startups");
const modelo = document.querySelector("#modelo-startups");

// Chave e Rota Oficial de Startups da API
const apiKey = "cv_drTXUDFHx8SgGi8z4Mg6ulpnA5g2-aD0FjnqP00Np5WZeEQe51OBIiPnVNQMTbzY";
const apiUrl = "https://api-ds.codeverse.dev.br/api/startups";

// Função para buscar e exibir todas as startups
async function buscarStartups() {
    resposta.textContent = "Carregando startups...";

    try {
        const retorno = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "x-api-key": apiKey
            }
        });

        if (!retorno.ok) {
            throw new Error(`Erro no servidor: ${retorno.status}`);
        }

        const resultado = await retorno.json();

        lista.innerHTML = "";

        const dados = Array.isArray(resultado) ? resultado : (resultado.data || []);

        if (dados.length === 0) {
            resposta.textContent = "Nenhuma startup encontrada.";
            return;
        }

        // Limpa a mensagem de carregamento
        resposta.textContent = "";

        // Percorre cada startup retornada pela API
        for (const startup of dados) {
            // Clona o conteúdo do template
            const card = modelo.content.cloneNode(true);

            // Preenchimento dos dados do card com as chaves exatas do tema
            card.querySelector(".nome").textContent = startup.title || "Sem nome";
            card.querySelector(".area_atuacao").textContent = startup.area_atuacao || "Não informada";
            card.querySelector(".ano_fundacao").textContent = startup.ano_fundacao || "Não informado";
            card.querySelector(".pais").textContent = startup.pais || "Não informado";

            const siteElem = card.querySelector(".site");
            if (siteElem) {
                siteElem.textContent = startup.site || "Não informado";
                if (startup.site) {
                    siteElem.href = startup.site.startsWith("http") ? startup.site : `https://${startup.site}`;
                }
            }

            // Tratamento para a imagem trazida pela API (imageUrl)
            const imagem = card.querySelector("img");
            if (imagem) {
                if (startup.imageUrl) {
                    imagem.src = startup.imageUrl;
                    imagem.alt = startup.title;
                    imagem.onerror = () => imagem.remove(); // Se a imagem falhar o carregamento, remove o elemento
                } else {
                    imagem.remove(); // Se for null ou vazia, remove o elemento
                }
            }

            lista.appendChild(card);
        }

    } catch (error) {
        resposta.textContent = "Não foi possível carregar as startups. Tente novamente!";
        console.error("Erro no GET:", error);
    }
}

// Execução inicial da função
buscarStartups();