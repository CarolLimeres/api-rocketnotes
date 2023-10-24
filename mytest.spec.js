// criação do teste:

// o it é uma função que recebe dois parâmetros:
// o primeiro é a descrição do nosso teste (oq esse teste vai fazer)
// o segundo é a função que vai de fato executar esse teste
it("result of the sum of 2 + 2 must be 4", () => {
  const a = 2;
  const b = 2;
  const result = a + b;

  //   nos testes trabalhamos com expectativas
  // aqui a minha expectativa é que a soma de 2 + 2 seja igual a 4
  // se a minha expectativa for atendida significa q o teste passou, senão não passou
  expect(result).toEqual(4);
});
