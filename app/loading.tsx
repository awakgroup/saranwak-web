export default function Loading() {
    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 py-8 text-[#201813] sm:px-5">
            <section className="mx-auto max-w-6xl">
                <div className="mb-6 rounded-[30px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_60px_rgba(47,35,25,0.08)] sm:p-6 md:p-8">
                    <div className="h-5 w-40 animate-pulse rounded-full bg-[#E7D8C8]" />
                    <div className="mt-5 h-12 w-full max-w-2xl animate-pulse rounded-2xl bg-[#E7D8C8] sm:h-16" />
                    <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded-full bg-[#E7D8C8]" />
                    <div className="mt-2 h-5 w-2/3 animate-pulse rounded-full bg-[#E7D8C8]" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] shadow-[0_14px_45px_rgba(47,35,25,0.06)]"
                        >
                            <div className="h-56 animate-pulse bg-[#E7D8C8]" />
                            <div className="space-y-3 p-5">
                                <div className="h-5 w-3/4 animate-pulse rounded-full bg-[#E7D8C8]" />
                                <div className="h-4 w-full animate-pulse rounded-full bg-[#E7D8C8]" />
                                <div className="h-4 w-2/3 animate-pulse rounded-full bg-[#E7D8C8]" />
                                <div className="mt-4 h-10 w-full animate-pulse rounded-full bg-[#E7D8C8]" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}