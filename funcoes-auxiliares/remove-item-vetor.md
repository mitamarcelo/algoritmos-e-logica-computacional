---
title: Remove item do vetor
---

## Definição

Essa função recebe como entradas:

- vetor de números inteiros: `vetor`;
- índice do valor a ser removido: `indice`.

E retorna um novo vetor com todos os valores do vetor original menos o valor presente no índice da entrada.

## Implementação

```portugol
Funcao removeElemento(vetor, indice)
    Vetor Inteiro novoVetor

    Se indice < 0 OU indice >= tamanhoVetor(vetor) Entao
        Escreva("Índice inválido.")
        Retorne
    FimSe

    /* Copia todos os valores do vetor para o novo vetor
        exceto o valor do índice dado
    */
    Para i De 0 Ate (tamanhoVetor(vetor) - 1) Passo 1 Faca
        Se indice = i Entao
            Continue
        FimSe

        novoVetor << vetor[i]
    FimPara

    Retorne novoVetor
FimFuncao
```