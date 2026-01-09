---
title: Exercício 1 — Andar em um tabuleiro
---

```portugol
Algoritmo: "Andar em um tabuleiro"

// Entradas do problema
Entrada Vetor Inteiro posInicial
Entrada Vetor Inteiro posFinal
Entrada Inteiro n
Entrada Inteiro m

Inicio
    // Declaração de variáveis auxiliares
    Vetor Inteiro posAtual
    Texto acao

    // Atribui à posição atual o valor da posição inicial
    posAtual[0] <- posInicial[0]
    posAtual[1] <- posInicial[1]

    // Cláusulas de guarda para exceções
    // Verificação de entradas:
    
    // Verificação do tamanho do tabuleiro 
    Se n < 0 OU m < 0 Entao
        Escreva ("Tamanho inválido do tabuleiro")     
        Retorne
    FimSe

    // Verificação do tamanho dos vetores de posição
    Se tamanhoVetor(posInicial) != 2 Entao
        Escreva ("Vetor posInicial com formato inválido")
        Retorne
    FimSe

    Se tamanhoVetor(posFinal) != 2 Entao
        Escreva ("Vetor posFinal com formato inválido")
        Retorne
    FimSe

    // Verificação da validade do vetor posição inicial
    Se posInicial[0] < 1 OU
    posInicial[0] > n OU
    posInicial[1] < 1 OU
    posInicial[1] > m Entao
        Escreva ("Posição inicial inválida")
        Retorne
    FimSe

    // Verificação da validade do vetor posição final
    Se posFinal[0] < 1 OU
    posFinal[0] > n OU
    posFinal[1] < 1 OU
    posFinal[1] > m Entao
        Escreva ("Posição final inválida")
        Retorne
    FimSe

    // Inicia o laço do jogo
    Enquanto posAtual != posFinal Faca
        Escreva ("Digite a ação: ")
        Leia (acao)

        Escolha acao
            Caso "Sobe"
                /* Verifica se está saindo do tabuleiro
                    Em caso positivo, interrompe a iteração
                    e volta ao início do laço
                */
                Se posAtual[1] - 1 < 1 Entao
                    Escreva ("Movimento inválido")
                    Continue
                FimSe

                posAtual[1] <- posAtual[1] - 1
            Caso "Desce"
                /* Verifica se está saindo do tabuleiro
                    Em caso positivo, interrompe a iteração
                    e volta ao início do laço
                */
                Se posAtual[1] + 1 > m Entao
                    Escreva ("Movimento inválido")
                    Continue
                FimSe

                posAtual[1] <- posAtual[1] + 1
            Caso "Direita"
                /* Verifica se está saindo do tabuleiro
                    Em caso positivo, interrompe a iteração
                    e volta ao início do laço
                */
                Se posAtual[0] + 1 > n Entao
                    Escreva ("Movimento inválido")
                    Continue
                FimSe

                posAtual[0] <- posAtual[0] + 1
            Caso "Esquerda"
                /* Verifica se está saindo do tabuleiro
                    Em caso positivo, interrompe a iteração
                    e volta ao início do laço
                */
                Se posAtual[0] - 1 < 1 Entao
                    Escreva ("Movimento inválido")
                    Continue
                FimSe

                posAtual[0] <- posAtual[0] - 1
            Caso Outro
                Escreva("Movimento inválido")
                Continue
        FimEscolha

        Escreva ("Posição atual", posAtual)
    FimEnquanto

    // Quando saimos do laço, posAtual = posVinal => Vitória
    Escreva ("Objetivo alcançado, parabéns!)
Fim
```