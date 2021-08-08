import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";

import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

jest.mock("../../services/prismic");

const posts = [
  {
    slug: "post-1",
    title: "Post 1",
    excerpt: "Post content",
    updatedAt: "April, 12, 2021",
  },
];

describe("Posts page", () => {
  it("should render correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "post-1",
            data: {
              title: [
                {
                  type: "heading",
                  text: "Post 1",
                }
              ],
              content: [
                {
                  type: "paragraph",
                  text: "Post content",
                }
              ],
            },
            last_publication_date: "2021-04-13",
          }
        ]
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "post-1",
              title: "Post 1",
              excerpt: "Post content",
              updatedAt: "April 12, 2021",
            },
          ],
        },
      })
    );
  });
});
