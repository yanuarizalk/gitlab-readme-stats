# GitLab Readme stats

Get dynamically generated github stats on your readmes!

## How to use

Copy paste this into your markdown content and that is it. Simple huh?

change the `?username=` value to your GitLab's username

```md
![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand)
```

## Hiding certain stats

To hide any specific stats you can pass a query parameter `?hide=` with an array of items you wanna hide.

> Options: `&hide=["todos","projects","groups","mrs"]`

```md
![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&hide=["groups","mrs"])
```

## Showing icons

To enable icons you can pass `show_icons=true` in the query param like so

```md
![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&show_icons=true)
```

## Themes

With inbuilt themes you can customize the look of the card without doing any [manual customization](#customization).

Use `?theme=THEME_NAME` parameter like so :-

```md
![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&show_icons=true&theme=dark)
```

### Currently available themes:

- `default`
- `dark`

### Customization

You can customize the appearance of your `Stats Card` however you like with URL params.

Customization Options:

| Option      | type      | description                          | Stats Card |
| ----------- | --------- | ------------------------------------ | ---------- |
| title_color | hex color | title color                          | `41419f`   |
| text_color  | hex color | body color                           | `1f1f1f`   |
| icon_color  | hex color | icon color                           | `41419f`   |
| bg_color    | hex color | card bg color                        | `FFFEFE`   |
| line_height | number    | control the line-height between text | 30         |
| hide_rank   | boolean   | hides the ranking                    | false      |
| hide_title  | boolean   | hides the stats title                | false      |
| hide_border | boolean   | hides the stats card border          | false      |
| show_icons  | boolean   | shows icons                          | false      |
| theme       | string    | sets inbuilt theme                   | 'default'  |

---

## Demo

- Default

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand)

- Hiding specific stats

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&hide=["mrs","projects"])

- Showing icons

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&hide=["projects"]&show_icons=true)

- Themes

Choose from any of the [default themes](#themes)

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&show_icons=true&theme=dark)

## GitLab GraphQL Explorer

Use the [GitLab GraphQL Explorer](https://gitlab.com/-/graphql-explorer) to see more options for a `User`. An example query:

```graphql
{
  user(username: "oregand") {
    name
    authoredMergeRequests {
      count
      totalTimeToMerge
      nodes {
        commitCount
      }
    }
    assignedMergeRequests {
      count
      nodes {
        commitCount
      }
    }
    projectMemberships {
      nodes {
        id
      }
    }
    groupMemberships {
      nodes {
        id
      }
    }
    todos {
      nodes {
        id
      }
    }
  }
}
```

Inspired heavily(almost entirely) by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats/)!

Made with :heart: and JavaScript.
