async function carregarEstoque() {

    const resposta =
        await fetch('http://localhost:3001/estoque');

    const produtos =
        await resposta.json();

    console.log(produtos);

}

carregarEstoque();