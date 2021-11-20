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

Other options:

- `&hide_border=true` hide the border box if you don't like it :D.
- `&line_height=30` control the line-height between text.

## GitLab GraphQL Explorer

https://gitlab.com/-/graphql-explorer

## Demo

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand)

- Hiding specific stats

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&hide=["todos","authoredMrs"])

- Showing icons

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&hide=["todos"]&show_icons=true)

Contributions are welcomed! <3

Made with :heart: and javascript.
