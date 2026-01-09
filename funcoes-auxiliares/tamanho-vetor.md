---
title: Tamanho de um vetor
---

## Definição

Essa função recebe como entrada:

- vetor qualquer: `vetor`;

E retorna o tamanho desse vetor.

## Implementação

```portugol
Funcao tamanhoVetor(vetor)
    Inteiro contador <- 0

    ParaCada item Em vetor Faca
        contador <- contador + 1
    FimParaCada 

    Retorne contador
FimFuncao
```