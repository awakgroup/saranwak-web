"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage("");

        if (!username.trim() || !password.trim()) {
            setErrorMessage("Username dan password wajib diisi.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Login gagal.");
            }

            router.push("/admin");
            router.refresh();
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Login gagal."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-5 text-white">
            <section className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-2xl md:p-8">
                <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-500">
                    Saranwak CMS
                </p>

                <h1 className="mt-4 text-4xl font-black tracking-tight">
                    Admin Login
                </h1>

                <p className="mt-3 text-sm leading-6 text-neutral-400">
                    Masuk dulu sebelum ngatur data tempat. Biar database gak jadi tempat
                    parkir bebas.
                </p>

                <form onSubmit={handleLogin} className="mt-8 space-y-5">
                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-neutral-300">
                            Username
                        </span>
                        <input
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="admin"
                            className="input-cms"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-neutral-300">
                            Password
                        </span>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                            className="input-cms"
                        />
                    </label>

                    {errorMessage ? (
                        <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-bold text-red-300">
                            {errorMessage}
                        </div>
                    ) : null}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Masuk..." : "Login"}
                    </button>
                </form>
            </section>

            <style jsx global>{`
        .input-cms {
          width: 100%;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.04);
          padding: 14px 16px;
          color: white;
          outline: none;
          transition: 0.2s ease;
        }

        .input-cms::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .input-cms:focus {
          border-color: rgba(255, 255, 255, 0.35);
          background: rgba(255, 255, 255, 0.07);
        }
      `}</style>
        </main>
    );
}