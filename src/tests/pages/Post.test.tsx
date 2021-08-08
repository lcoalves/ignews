import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/client";
import { mocked } from "ts-jest/utils";

import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/client");
jest.mock("../../services/prismic");

const post = {
  slug: "post-1",
  title: "Post 1",
  content: "<p>Post content</p>",
  updatedAt: "April, 12, 2021",
};

describe("Post page", () => {
  it("should render correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: {
        slug: "post-1",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/posts/preview/post-1",
        }),
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
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
      }),
    } as any);

    const response = await getServerSideProps({
      params: {
        slug: "post-1",
      },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "post-1",
            title: "Post 1",
            content: "<p>Post content</p>",
            updatedAt: "April 12, 2021",
          }
        }
      })
    );
  });
});
