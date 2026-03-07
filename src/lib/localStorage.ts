export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Simulation = {
  id: string;
  user_id: string;
  title: string;
  quantity: number;
  initial_weight: number;
  final_weight: number;
  feeding_days: number;
  arroba_value: number;
  lease_per_animal: number;
  workers: number;
  labor_cost_per_worker: number;
  supplement_cost: number;
  supplement_quantity: number;
  supplement_period_days: number;
  supplement_consumption_per_day: number;
  other_expenses: number;
  total_revenue: number;
  total_expenses: number;
  result_per_animal: number;
  profit_margin_percentage: number;
  created_at: string;
  updated_at: string;
};

const USERS_KEY = 'cattle_sim_users';
const SIMULATIONS_KEY = 'cattle_sim_simulations';
const CURRENT_USER_KEY = 'cattle_sim_current_user';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const localStorageService = {
  users: {
    getAll(): User[] {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    },

    create(email: string, password: string): User {
      const users = this.getAll();

      if (users.find(u => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      const user: User = {
        id: generateId(),
        email,
        created_at: new Date().toISOString(),
      };

      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(`password_${user.id}`, password);

      return user;
    },

    findByEmail(email: string): User | null {
      const users = this.getAll();
      return users.find(u => u.email === email) || null;
    },

    verifyPassword(userId: string, password: string): boolean {
      const storedPassword = localStorage.getItem(`password_${userId}`);
      return storedPassword === password;
    },

    updatePassword(userId: string, newPassword: string): void {
      localStorage.setItem(`password_${userId}`, newPassword);
    }
  },

  auth: {
    getCurrentUser(): User | null {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    },

    setCurrentUser(user: User | null): void {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    },

    signUp(email: string, password: string): User {
      const user = localStorageService.users.create(email, password);
      this.setCurrentUser(user);
      return user;
    },

    signIn(email: string, password: string): User {
      const user = localStorageService.users.findByEmail(email);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      if (!localStorageService.users.verifyPassword(user.id, password)) {
        throw new Error('Senha incorreta');
      }

      this.setCurrentUser(user);
      return user;
    },

    signOut(): void {
      this.setCurrentUser(null);
    },

    resetPassword(email: string, newPassword: string): void {
      const user = localStorageService.users.findByEmail(email);

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      localStorageService.users.updatePassword(user.id, newPassword);
    }
  },

  simulations: {
    getAll(userId: string): Simulation[] {
      const data = localStorage.getItem(SIMULATIONS_KEY);
      const allSimulations: Simulation[] = data ? JSON.parse(data) : [];
      return allSimulations.filter(s => s.user_id === userId);
    },

    getById(id: string): Simulation | null {
      const data = localStorage.getItem(SIMULATIONS_KEY);
      const allSimulations: Simulation[] = data ? JSON.parse(data) : [];
      return allSimulations.find(s => s.id === id) || null;
    },

    create(userId: string, simulationData: Omit<Simulation, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Simulation {
      const data = localStorage.getItem(SIMULATIONS_KEY);
      const allSimulations: Simulation[] = data ? JSON.parse(data) : [];

      const simulation: Simulation = {
        ...simulationData,
        id: generateId(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      allSimulations.push(simulation);
      localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(allSimulations));

      return simulation;
    },

    update(id: string, updates: Partial<Simulation>): Simulation {
      const data = localStorage.getItem(SIMULATIONS_KEY);
      const allSimulations: Simulation[] = data ? JSON.parse(data) : [];

      const index = allSimulations.findIndex(s => s.id === id);

      if (index === -1) {
        throw new Error('Simulação não encontrada');
      }

      allSimulations[index] = {
        ...allSimulations[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(allSimulations));

      return allSimulations[index];
    },

    delete(id: string): void {
      const data = localStorage.getItem(SIMULATIONS_KEY);
      const allSimulations: Simulation[] = data ? JSON.parse(data) : [];

      const filtered = allSimulations.filter(s => s.id !== id);
      localStorage.setItem(SIMULATIONS_KEY, JSON.stringify(filtered));
    }
  }
};
