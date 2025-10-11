export async function registerUser(username, email, password, province) {
  try {
    console.log("sending:", { username, email, password, role: "user", province });

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username, 
        email, 
        password, 
        role: "user",
        province,
      }),
    });

    const data = await res.json();
    console.log("response:", data);

    if (!res.ok) {
      throw new Error(data.data?.email || data.message || "Registration failed ");
    }

    return data;
  } catch (err) {
    console.error("Register error:", err.message);
    throw err;
  }
}
