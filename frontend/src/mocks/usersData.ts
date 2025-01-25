// src/services/mockApi.ts
const mockUsers = [
  {
    id: "1",
    email: "raghda@gmail.com",
    password: "raghda",
    name: "Raghda Tarek",
    role: "admin",
  },
];

export const mockLogin = async (credentials: {
  email: string;
  password: string;
}) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const { password, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token: "mock-jwt-token",
  };
};
