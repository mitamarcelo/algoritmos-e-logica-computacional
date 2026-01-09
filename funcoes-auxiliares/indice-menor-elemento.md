---
title: Índice do menor elemento de um vetor
---

## Definição

Essa função recebe como entrada:

- vetor de números inteiros: `vetor`;

E retorna o índice da primeira ocorrência do menor valor nesse vetor.

## Implementação

```portugol
Funcao indiceMenorElemento(vetor)
    Inteiro minimo <- nulo
    Inteiro indiceMinimo <- 0

    Se tamanhoVetor(vetor) = 0 Entao
        Retorne -1
    FimSe

    Para i De 0 Ate tamanhoVetor(vetor) Passo 1 Faca
        Se minimo = nulo OU vetor[i] < minimo Entao
            minimo <- vetor[i]
            indiceMinimo <- i 
        FimSe
    FimPara 

    Retorne indiceMinimo
FimFuncao
```