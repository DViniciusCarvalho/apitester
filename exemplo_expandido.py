from arvore_educacional import *

def criar_estrutura_expandida():
    """Cria uma estrutura mais completa com múltiplas disciplinas"""
    
    # ===== DISCIPLINA: MATEMÁTICA =====
    matematica = Disciplina("Matemática")
    matematica.descricao = "Departamento de Matemática"
    
    # Curso: Cálculo I
    calculo_i = Curso("Cálculo I", "MAT101")
    calculo_i.creditos = 4
    
    # Turma A de Cálculo I
    turma_a_calc = Turma("Turma A", "Prof. Silva")
    turma_a_calc.periodo = "2024.1"
    turma_a_calc.max_alunos = 30
    
    # Turma B de Cálculo I
    turma_b_calc = Turma("Turma B", "Prof. Oliveira")
    turma_b_calc.periodo = "2024.1"
    turma_b_calc.max_alunos = 25
    
    # Adicionar alunos às turmas de Cálculo I
    for i in range(1, 6):
        turma_a_calc.adicionar_aluno(Aluno(f"Aluno {i} Calc A", f"2024{i:03d}"))
    
    for i in range(1, 4):
        turma_b_calc.adicionar_aluno(Aluno(f"Aluno {i} Calc B", f"2024{i+5:03d}"))
    
    calculo_i.adicionar_turma(turma_a_calc)
    calculo_i.adicionar_turma(turma_b_calc)
    
    # Curso: Álgebra Linear
    algebra = Curso("Álgebra Linear", "MAT201")
    algebra.creditos = 3
    
    turma_algebra = Turma("Turma Única", "Prof. Costa")
    turma_algebra.periodo = "2024.1"
    turma_algebra.max_alunos = 20
    
    for i in range(1, 4):
        turma_algebra.adicionar_aluno(Aluno(f"Aluno {i} Alg", f"2024{i+8:03d}"))
    
    algebra.adicionar_turma(turma_algebra)
    
    matematica.adicionar_curso(calculo_i)
    matematica.adicionar_curso(algebra)
    
    # ===== DISCIPLINA: FÍSICA =====
    fisica = Disciplina("Física")
    fisica.descricao = "Departamento de Física"
    
    # Curso: Mecânica Clássica
    mecanica = Curso("Mecânica Clássica", "FIS101")
    mecanica.creditos = 4
    
    turma_mecanica = Turma("Turma Principal", "Prof. Santos")
    turma_mecanica.periodo = "2024.1"
    turma_mecanica.max_alunos = 35
    
    for i in range(1, 7):
        turma_mecanica.adicionar_aluno(Aluno(f"Aluno {i} Física", f"2024{i+11:03d}"))
    
    mecanica.adicionar_turma(turma_mecanica)
    fisica.adicionar_curso(mecanica)
    
    # ===== DISCIPLINA: COMPUTAÇÃO =====
    computacao = Disciplina("Computação")
    computacao.descricao = "Departamento de Computação"
    
    # Curso: Programação I
    prog_i = Curso("Programação I", "COM101")
    prog_i.creditos = 4
    
    # Múltiplas turmas de Programação
    turmas_prog = []
    professores = ["Prof. Lima", "Prof. Rocha", "Prof. Ferreira"]
    
    for i, prof in enumerate(professores):
        turma = Turma(f"Turma {chr(65+i)}", prof)
        turma.periodo = "2024.1"
        turma.max_alunos = 25
        
        for j in range(1, 4):
            turma.adicionar_aluno(Aluno(f"Aluno {j} Prog {chr(65+i)}", f"2024{j+17+i*3:03d}"))
        
        turmas_prog.append(turma)
        prog_i.adicionar_turma(turma)
    
    computacao.adicionar_curso(prog_i)
    
    return [matematica, fisica, computacao]

def mostrar_estatisticas_gerais(disciplinas):
    """Mostra estatísticas gerais de todas as disciplinas"""
    print("\n" + "="*60)
    print("📊 ESTATÍSTICAS GERAIS DO SISTEMA")
    print("="*60)
    
    total_disciplinas = len(disciplinas)
    total_cursos = 0
    total_turmas = 0
    total_alunos = 0
    
    for disciplina in disciplinas:
        total_cursos += len(disciplina.filhos)
        for curso in disciplina.filhos:
            total_turmas += len(curso.filhos)
            for turma in curso.filhos:
                total_alunos += len(turma.filhos)
    
    print(f"🏫 Total de Disciplinas: {total_disciplinas}")
    print(f"📚 Total de Cursos: {total_cursos}")
    print(f"👥 Total de Turmas: {total_turmas}")
    print(f"👤 Total de Alunos: {total_alunos}")
    
    # Mostrar distribuição por disciplina
    print(f"\n📈 DISTRIBUIÇÃO POR DISCIPLINA:")
    for disciplina in disciplinas:
        cursos_disc = len(disciplina.filhos)
        turmas_disc = sum(len(curso.filhos) for curso in disciplina.filhos)
        alunos_disc = sum(len(turma.filhos) for curso in disciplina.filhos for turma in curso.filhos)
        
        print(f"   {disciplina.nome}: {cursos_disc} cursos, {turmas_disc} turmas, {alunos_disc} alunos")

def main():
    print("🌳 ESTRUTURA DE ÁRVORE EDUCACIONAL EXPANDIDA")
    print("=" * 60)
    
    # Criar estrutura expandida
    disciplinas = criar_estrutura_expandida()
    
    # Mostrar cada disciplina
    for disciplina in disciplinas:
        print(f"\n📋 {disciplina.nome.upper()}:")
        print("-" * 40)
        disciplina.mostrar()
    
    # Mostrar estatísticas gerais
    mostrar_estatisticas_gerais(disciplinas)
    
    print("\n" + "="*60)
    print("✅ Estrutura expandida criada com sucesso!")

if __name__ == "__main__":
    main()