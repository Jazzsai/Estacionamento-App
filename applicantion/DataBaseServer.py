import psycopg2
from psycopg2 import Error

class DataBaseServer:
    def __init__(self):
        self.conn = None
        self.connect()

    def connect(self):
        try:
            self.conn = psycopg2.connect(
                dbname='EstacionamentoDB',
                user='postgres',
                password='123',
                host='localhost',
                port='5432'
            )
            self.cursor = self.conn.cursor()
            print("Conexão com o banco de dados estabelecida com sucesso.")
        except Error as e:
            print(f"Erro ao conectar ao banco de dados: {e}")

    def create_tables(self):
        try:
            if self.conn:
                cursor = self.conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS vehicles (
                        id SERIAL PRIMARY KEY,
                        plate VARCHAR(15) UNIQUE NOT NULL,
                        owner VARCHAR(255),
                        model VARCHAR(255),
                        color VARCHAR(50),
                        entry_time TIMESTAMP,
                        exit_time TIMESTAMP,
                        paid BOOLEAN DEFAULT FALSE
                    );
                """)
                self.conn.commit()
                print("Tabela 'vehicles' criada com sucesso.")
                return 'created'
        except Error as e:
            self.conn.rollback()  # Adicionado para evitar transação abortada
            print(f'Erro: {e}')
            return 'error'
        finally:
            if self.conn:
                cursor.close()

    def register_vehicle(self, plate, owner, model, color, entry_time):
        try:
            if self.conn:
                cursor = self.conn.cursor()
                cursor.execute("""
                    INSERT INTO vehicles (plate, owner, model, color, entry_time) 
                    VALUES (%s, %s, %s, %s, %s);
                """, (plate, owner, model, color, entry_time))
                self.conn.commit()
                print("Veículo registrado com sucesso.")
                return 'registered'
        except Error as e:
            self.conn.rollback()  # Adicionado para evitar transação abortada
            print(f'Erro: {e}')
            return 'error'
        finally:
            if self.conn:
                cursor.close()

    def exit_vehicle(self, plate, exit_time, payment_status):
        try:
            if self.conn:
                cursor = self.conn.cursor()
                cursor.execute("""
                    UPDATE vehicles
                    SET exit_time = %s, paid = %s
                    WHERE plate = %s;
                """, (exit_time, payment_status, plate))
                self.conn.commit()
                print("Saída do veículo registrada.")
                return 'exit_recorded'
        except Error as e:
            self.conn.rollback()  # Adicionado para evitar transação abortada
            print(f'Erro: {e}')
            return 'error'
        finally:
            if self.conn:
                cursor.close()

    def get_vehicle_history(self):
        try:
            if self.conn:
                cursor = self.conn.cursor()
                cursor.execute("SELECT * FROM vehicles ORDER BY entry_time DESC;")
                history = cursor.fetchall()
                print("Histórico de veículos obtido.")
                return history
        except Error as e:
            self.conn.rollback()  # Adicionado para evitar transação abortada
            print(f'Erro: {e}')
            return 'error'
        finally:
            if self.conn:
                cursor.close()
    
    def check_vehicle_status(self, plate):
        try:
            if self.conn:
                cursor = self.conn.cursor()
                cursor.execute("SELECT * FROM vehicles WHERE plate = %s;", (plate,))
                vehicle = cursor.fetchone()

                if vehicle is None:
                    return "O veículo nunca esteve no estacionamento."
                
                current_status = "O veículo está atualmente no estacionamento." if vehicle[6] is None else "O veículo já saiu do estacionamento."
                payment_status = "Já realizou o pagamento." if vehicle[7] else "Não foi pago."
                
                return f"{current_status} {payment_status}"
        except Error as e:
            self.conn.rollback()  # Adicionado para evitar transação abortada
            print(f'Erro: {e}')
            return 'error'
        finally:
            if self.conn:
                cursor.close()

    def vehicle_exists(self, plate):
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM vehicles WHERE plate = %s", (plate,))
            count = cursor.fetchone()[0]
            return count > 0
        except Error as e:
            print("Erro ao verificar o veículo:", e)
            return False
        finally:
            cursor.close()

if __name__ == '__main__':
    db = DataBaseServer()
    db.create_tables()
    # Exemplo de registro de um veículo
    #db.register_vehicle("ABC1234", "John Doe", "Honda Civic", "Blue", "2024-10-28 08:30:00")
