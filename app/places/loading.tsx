export default function PlacesLoading() {
    return (
        <main className="min-h-screen bg-[#F4F1EA] px-4 pb-12 pt-8 text-[#201813] sm:px-5 sm:pb-16 sm:pt-10">
            <section className="mx-auto max-w-6xl">
                <div className="mb-6 rounded-[30px] border border-[#E7D8C8] bg-[#FFFDF8] p-5 shadow-[0_18px_60px_rgba(47,35,25,0.08)] sm:p-6 md:p-8">
                    <div className="mb-3 h-8 w-44 animate-pulse rounded-full bg-[#E7D8C8]" />

                    <div className="h-12 w-full max-w-3xl animate-pulse rounded-2xl bg-[#E7D8C8] sm:h-16" />

                    <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-full bg-[#E7D8C8]" />
                    <div className="mt-2 h-5 w-2/3 animate-pulse rounded-full bg-[#E7D8C8]" />

                    <div className="mt-6 grid gap-3 border-t border-[#E7D8C8] pt-5 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-2xl border border-[#E7D8C8] bg-[#F8F1E8]/80 p-4"
                            >
                                <div className="h-8 w-24 animate-pulse rounded-full bg-[#E7D8C8]" />
                                <div className="mt-2 h-4 w-32 animate-pulse rounded-full bg-[#E7D8C8]" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6 rounded-[28px] border border-[#E7D8C8] bg-[#FFFDF8] p-4 shadow-[0_14px_45px_rgba(47,35,25,0.06)] sm:p-5">
                    <div className="h-5 w-40 animate-pulse rounded-full bg-[#E7D8C8]" />

                    <div className="mt-4 flex flex-wrap gap-2">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-10 w-28 animate-pulse rounded-full bg-[#E7D8C8]"
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="h-4 w-32 animate-pulse rounded-full bg-[#E7D8C8]" />
                        <div className="mt-2 h-8 w-64 animate-pulse rounded-full bg-[#E7D8C8]" />
                    </div>

                    <div className="h-5 w-full max-w-md animate-pulse rounded-full bg-[#E7D8C8]" />
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-[28px] border border-[#EADCCB] bg-[#FFFDF8] shadow-[0_14px_40px_rgba(47,35,25,0.07)]"
                        >
                            <div className="aspect-[4/3] animate-pulse bg-[#E7D8C8]" />

                            <div className="space-y-4 p-5">
                                <div className="rounded-[22px] border border-[#EADCCB] bg-[#F8F1E8]/80 p-4">
                                    <div className="h-4 w-28 animate-pulse rounded-full bg-[#E7D8C8]" />
                                    <div className="mt-3 flex gap-2">
                                        <div className="h-8 w-20 animate-pulse rounded-full bg-[#E7D8C8]" />
                                        <div className="h-8 w-24 animate-pulse rounded-full bg-[#E7D8C8]" />
                                    </div>
                                </div>

                                <div className="h-4 w-full animate-pulse rounded-full bg-[#E7D8C8]" />
                                <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#E7D8C8]" />

                                <div className="flex gap-2">
                                    <div className="h-8 w-20 animate-pulse rounded-full bg-[#E7D8C8]" />
                                    <div className="h-8 w-24 animate-pulse rounded-full bg-[#E7D8C8]" />
                                    <div className="h-8 w-16 animate-pulse rounded-full bg-[#E7D8C8]" />
                                </div>

                                <div className="border-t border-[#EADCCB] pt-4">
                                    <div className="h-4 w-24 animate-pulse rounded-full bg-[#E7D8C8]" />
                                    <div className="mt-2 h-6 w-36 animate-pulse rounded-full bg-[#E7D8C8]" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}