class No:
    """Classe base para representar um nó na árvore"""
    def __init__(self, nome):
        self.nome = nome
        self.filhos = []
    
    def adicionar_filho(self, filho):
        self.filhos.append(filho)
    
    def mostrar(self, nivel=0):
        indentacao = "  " * nivel
        print(f"{indentacao}├─ {self.nome}")
        for filho in self.filhos:
            filho.mostrar(nivel + 1)

class Disciplina(No):
    """Representa uma disciplina (ex: Matemática)"""
    def __init__(self, nome):
        super().__init__(nome)
        self.descricao = ""
    
    def adicionar_curso(self, curso):
        self.adicionar_filho(curso)

class Curso(No):
    """Representa um curso específico (ex: Cálculo I)"""
    def __init__(self, nome, codigo):
        super().__init__(nome)
        self.codigo = codigo
        self.creditos = 0
    
    def adicionar_turma(self, turma):
        self.adicionar_filho(turma)

class Turma(No):
    """Representa uma turma (ex: Turma A)"""
    def __init__(self, nome, professor):
        super().__init__(nome)
        self.professor = professor
        self.periodo = ""
        self.max_alunos = 0
    
    def adicionar_aluno(self, aluno):
        self.adicionar_filho(aluno)

class Aluno(No):
    """Representa um aluno"""
    def __init__(self, nome, matricula):
        super().__init__(nome)
        self.matricula = matricula
        self.nota = 0.0
    
    def mostrar(self, nivel=0):
        indentacao = "  " * nivel
        print(f"{indentacao}├─ {self.nome} (Matrícula: {self.matricula})")

def criar_estrutura_exemplo():
    """Cria a estrutura de exemplo: Matemática -> Cálculo I -> Turma A -> Alunos"""
    
    # Criar a disciplina Matemática
    matematica = Disciplina("Matemática")
    matematica.descricao = "Departamento de Matemática"
    
    # Criar o curso Cálculo I
    calculo_i = Curso("Cálculo I", "MAT101")
    calculo_i.creditos = 4
    
    # Criar a Turma A
    turma_a = Turma("Turma A", "Prof. Silva")
    turma_a.periodo = "2024.1"
    turma_a.max_alunos = 30
    
    # Criar alunos
    aluno1 = Aluno("João Silva", "2024001")
    aluno2 = Aluno("Maria Santos", "2024002")
    aluno3 = Aluno("Pedro Costa", "2024003")
    aluno4 = Aluno("Ana Oliveira", "2024004")
    aluno5 = Aluno("Carlos Lima", "2024005")
    
    # Montar a árvore
    turma_a.adicionar_aluno(aluno1)
    turma_a.adicionar_aluno(aluno2)
    turma_a.adicionar_aluno(aluno3)
    turma_a.adicionar_aluno(aluno4)
    turma_a.adicionar_aluno(aluno5)
    
    calculo_i.adicionar_turma(turma_a)
    matematica.adicionar_curso(calculo_i)
    
    return matematica

def mostrar_estatisticas(no, nivel=0):
    """Mostra estatísticas da árvore"""
    if isinstance(no, Disciplina):
        print(f"\n📚 Disciplina: {no.nome}")
        print(f"   Descrição: {no.descricao}")
        total_cursos = len(no.filhos)
        print(f"   Total de cursos: {total_cursos}")
        
    elif isinstance(no, Curso):
        print(f"\n📖 Curso: {no.nome}")
        print(f"   Código: {no.codigo}")
        print(f"   Créditos: {no.creditos}")
        total_turmas = len(no.filhos)
        print(f"   Total de turmas: {total_turmas}")
        
    elif isinstance(no, Turma):
        print(f"\n👥 Turma: {no.nome}")
        print(f"   Professor: {no.professor}")
        print(f"   Período: {no.periodo}")
        print(f"   Capacidade: {no.max_alunos}")
        total_alunos = len(no.filhos)
        print(f"   Total de alunos: {total_alunos}")
        
    elif isinstance(no, Aluno):
        print(f"   👤 {no.nome} - Matrícula: {no.matricula}")
    
    # Recursivamente processar filhos
    for filho in no.filhos:
        mostrar_estatisticas(filho, nivel + 1)

def main():
    print("🌳 ESTRUTURA DE ÁRVORE EDUCACIONAL")
    print("=" * 50)
    
    # Criar a estrutura
    estrutura = criar_estrutura_exemplo()
    
    # Mostrar a árvore visualmente
    print("\n📋 ESTRUTURA HIERÁRQUICA:")
    print("=" * 30)
    estrutura.mostrar()
    
    # Mostrar estatísticas
    print("\n📊 ESTATÍSTICAS:")
    print("=" * 30)
    mostrar_estatisticas(estrutura)
    
    print("\n" + "=" * 50)
    print("✅ Estrutura criada com sucesso!")

if __name__ == "__main__":
    main()