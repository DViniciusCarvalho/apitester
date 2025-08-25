# 🌳 Estrutura de Árvore para Organização Educacional

Este projeto demonstra como usar estruturas de árvore para organizar hierarquicamente disciplinas, cursos, turmas e alunos em um sistema educacional.

## 📚 Conceito da Estrutura

A organização segue uma hierarquia em árvore com 4 níveis:

```
🏫 Disciplina (ex: Matemática)
  └── 📖 Curso (ex: Cálculo I)
      └── 👥 Turma (ex: Turma A)
          └── 👤 Alunos (ex: João, Maria, Pedro...)
```

### 🔍 Vantagens da Estrutura em Árvore

1. **Organização Hierárquica**: Cada nível tem uma relação clara com o nível superior
2. **Facilidade de Navegação**: É fácil percorrer a estrutura de cima para baixo
3. **Escalabilidade**: Pode crescer facilmente adicionando novos nós
4. **Busca Eficiente**: Algoritmos de busca em árvore são eficientes
5. **Manutenção Simples**: Adicionar/remover elementos é direto

## 🏗️ Arquitetura das Classes

### Classe Base: `No`
- Classe abstrata que define a estrutura básica de um nó
- Contém nome e lista de filhos
- Método `mostrar()` para visualização da árvore

### Classes Especializadas:

#### `Disciplina`
- Representa um departamento ou área de conhecimento
- Contém descrição e lista de cursos
- Exemplo: Matemática, Física, Computação

#### `Curso`
- Representa uma disciplina específica
- Contém código, créditos e lista de turmas
- Exemplo: Cálculo I, Álgebra Linear, Programação I

#### `Turma`
- Representa uma seção específica de um curso
- Contém professor, período e capacidade máxima
- Exemplo: Turma A, Turma B, Turma Principal

#### `Aluno`
- Representa um estudante matriculado
- Contém nome, matrícula e nota
- Exemplo: João Silva (2024001)

## 🚀 Como Usar

### 1. Estrutura Básica
```python
python3 arvore_educacional.py
```

### 2. Estrutura Expandida
```python
python3 exemplo_expandido.py
```

## 📊 Exemplo de Saída

```
🌳 ESTRUTURA DE ÁRVORE EDUCACIONAL
==================================================

📋 ESTRUTURA HIERÁRQUICA:
==============================
├─ Matemática
  ├─ Cálculo I
    ├─ Turma A
      ├─ João Silva (Matrícula: 2024001)
      ├─ Maria Santos (Matrícula: 2024002)
      ├─ Pedro Costa (Matrícula: 2024003)
      ├─ Ana Oliveira (Matrícula: 2024004)
      ├─ Carlos Lima (Matrícula: 2024005)
```

## 🔧 Funcionalidades

### Adicionar Elementos
- `disciplina.adicionar_curso(curso)`
- `curso.adicionar_turma(turma)`
- `turma.adicionar_aluno(aluno)`

### Visualização
- `estrutura.mostrar()` - Mostra a árvore hierarquicamente
- `mostrar_estatisticas(no)` - Mostra estatísticas detalhadas

### Estatísticas
- Contagem total de elementos em cada nível
- Distribuição por disciplina
- Capacidade das turmas

## 🎯 Casos de Uso

1. **Sistema de Matrículas**: Organizar alunos por turmas
2. **Gestão Acadêmica**: Controle de disciplinas e cursos
3. **Relatórios**: Estatísticas de ocupação e distribuição
4. **Planejamento**: Organização de horários e salas

## 🚀 Extensões Possíveis

- **Persistência**: Salvar/carregar estrutura em banco de dados
- **Interface Gráfica**: Visualização interativa da árvore
- **Algoritmos de Busca**: Buscar alunos, turmas ou cursos
- **Validações**: Verificar regras de negócio (capacidade, pré-requisitos)
- **Relatórios**: Exportar dados em diferentes formatos

## 💡 Conceitos de Estruturas de Dados Aplicados

- **Árvore N-ária**: Cada nó pode ter múltiplos filhos
- **Herança**: Classes especializadas herdam da classe base
- **Recursão**: Métodos que se chamam recursivamente para percorrer a árvore
- **Polimorfismo**: Diferentes tipos de nós com comportamentos específicos

## 🔍 Complexidade

- **Tempo de Inserção**: O(1) para adicionar elementos
- **Tempo de Busca**: O(n) onde n é o número total de nós
- **Espaço**: O(n) para armazenar todos os elementos
- **Navegação**: O(h) onde h é a altura da árvore

Esta estrutura é ideal para sistemas educacionais de pequeno a médio porte, oferecendo uma organização clara e eficiente dos dados acadêmicos.