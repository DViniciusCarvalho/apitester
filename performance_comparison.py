import time
import random
from typing import List, Optional
from dataclasses import dataclass
from collections import defaultdict

@dataclass
class Aluno:
    matricula: int
    nome: str
    curso: str

class ListaEncadeada:
    class No:
        def __init__(self, aluno: Aluno):
            self.aluno = aluno
            self.proximo = None
    
    def __init__(self):
        self.cabeca = None
        self.tamanho = 0
    
    def inserir(self, aluno: Aluno):
        novo_no = self.No(aluno)
        novo_no.proximo = self.cabeca
        self.cabeca = novo_no
        self.tamanho += 1
    
    def buscar(self, matricula: int) -> Optional[Aluno]:
        atual = self.cabeca
        while atual:
            if atual.aluno.matricula == matricula:
                return atual.aluno
            atual = atual.proximo
        return None

class TabelaHash:
    def __init__(self, tamanho: int = 10000):
        self.tabela = [[] for _ in range(tamanho)]
        self.tamanho = tamanho
    
    def _hash(self, matricula: int) -> int:
        return matricula % self.tamanho
    
    def inserir(self, aluno: Aluno):
        indice = self._hash(aluno.matricula)
        self.tabela[indice].append(aluno)
    
    def buscar(self, matricula: int) -> Optional[Aluno]:
        indice = self._hash(matricula)
        for aluno in self.tabela[indice]:
            if aluno.matricula == matricula:
                return aluno
        return None

def gerar_dados_teste(n: int) -> List[Aluno]:
    """Gera n alunos com dados aleatórios para teste"""
    cursos = ["Engenharia", "Medicina", "Direito", "Administração", "Ciência da Computação"]
    alunos = []
    
    for i in range(n):
        matricula = 10000 + i
        nome = f"Aluno_{i}"
        curso = random.choice(cursos)
        alunos.append(Aluno(matricula, nome, curso))
    
    return alunos

def testar_array(alunos: List[Aluno], matricula_busca: int) -> tuple:
    """Testa busca linear em array"""
    inicio = time.time()
    
    # Busca linear O(n)
    resultado = None
    for aluno in alunos:
        if aluno.matricula == matricula_busca:
            resultado = aluno
            break
    
    fim = time.time()
    return resultado, fim - inicio

def testar_lista_encadeada(alunos: List[Aluno], matricula_busca: int) -> tuple:
    """Testa busca em lista encadeada"""
    # Construir lista encadeada
    lista = ListaEncadeada()
    for aluno in alunos:
        lista.inserir(aluno)
    
    inicio = time.time()
    resultado = lista.buscar(matricula_busca)
    fim = time.time()
    
    return resultado, fim - inicio

def testar_tabela_hash(alunos: List[Aluno], matricula_busca: int) -> tuple:
    """Testa busca em tabela hash"""
    # Construir tabela hash
    hash_table = TabelaHash()
    for aluno in alunos:
        hash_table.inserir(aluno)
    
    inicio = time.time()
    resultado = hash_table.buscar(matricula_busca)
    fim = time.time()
    
    return resultado, fim - inicio

def main():
    print("=== COMPARAÇÃO DE PERFORMANCE: BUSCA POR MATRÍCULA ===\n")
    
    # Gerar 10.000 alunos para teste
    n_alunos = 10000
    print(f"Gerando {n_alunos} alunos para teste...")
    alunos = gerar_dados_teste(n_alunos)
    
    # Escolher uma matrícula para buscar (que sabemos que existe)
    matricula_busca = 15000  # Deve existir nos dados gerados
    
    print(f"\nBuscando aluno com matrícula: {matricula_busca}")
    print("-" * 60)
    
    # Teste 1: Array (busca linear)
    resultado_array, tempo_array = testar_array(alunos, matricula_busca)
    print(f"Array (Busca Linear):")
    print(f"  Tempo: {tempo_array:.6f} segundos")
    print(f"  Complexidade: O(n)")
    print(f"  Resultado: {resultado_array.nome if resultado_array else 'Não encontrado'}")
    
    # Teste 2: Lista Encadeada
    resultado_lista, tempo_lista = testar_lista_encadeada(alunos, matricula_busca)
    print(f"\nLista Encadeada:")
    print(f"  Tempo: {tempo_lista:.6f} segundos")
    print(f"  Complexidade: O(n)")
    print(f"  Resultado: {resultado_lista.nome if resultado_lista else 'Não encontrado'}")
    
    # Teste 3: Tabela Hash
    resultado_hash, tempo_hash = testar_tabela_hash(alunos, matricula_busca)
    print(f"\nTabela Hash:")
    print(f"  Tempo: {tempo_hash:.6f} segundos")
    print(f"  Complexidade: O(1) - caso médio")
    print(f"  Resultado: {resultado_hash.nome if resultado_hash else 'Não encontrado'}")
    
    print("\n" + "=" * 60)
    print("ANÁLISE DE PERFORMANCE:")
    print("=" * 60)
    
    # Comparar tempos
    if tempo_array < tempo_lista and tempo_array < tempo_hash:
        mais_rapido = "Array"
    elif tempo_lista < tempo_array and tempo_lista < tempo_hash:
        mais_rapido = "Lista Encadeada"
    else:
        mais_rapido = "Tabela Hash"
    
    print(f"Mais rápido: {mais_rapido}")
    print(f"\nArray vs Hash: {tempo_array/tempo_hash:.2f}x mais lento")
    print(f"Lista vs Hash: {tempo_lista/tempo_hash:.2f}x mais lento")
    
    print("\nRECOMENDAÇÕES:")
    print("1. Para busca única: Tabela Hash (O(1) caso médio)")
    print("2. Para múltiplas buscas: Tabela Hash (melhor amortização)")
    print("3. Para memória limitada: Array (menos overhead)")
    print("4. Para inserções frequentes: Lista Encadeada (O(1) inserção)")

if __name__ == "__main__":
    main()