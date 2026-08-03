import HomePage from "@/app/(site)/page";

jest.mock("@/lib/prismaDB", () => ({
  __esModule: true,
  default: {
    post: {
      findMany: jest.fn().mockResolvedValue([]),
    },
  },
}));

describe("Homepage", () => {
  it("returns the home page content", async () => {
    const page = await HomePage();
    expect(page).toBeTruthy();
  });
});
