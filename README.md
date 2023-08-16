# GitLab Readme stats

Get dynamically generated GitLab stats on your readmes!

## How to use

Copy paste this into your markdown content and that is it. Simple huh?

change the `?username=` value to your GitLab's username

```md
![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand)
```

If you notice an error using the example above, please see [how to deploy your own](##deploy-yourself).

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

Card Customization Options:

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

### Remote Data Sources

As GitLab makes it easy to deploy your own instance of GitLab, there might be a desire to track your GitLab stats across
more than just `gitlab.com`.

GitLab readme stats has the capability to generate stats for a remote instance of GitLab. It currently requires you
to deploy an instance of GitLab readme stats yourself to vercel as you will need to add your remote gitlab token to your
vercel deployment.

Follow the steps outlined in [how to deploy your own](##deploy-yourself) instance of GitLab readme stats for a general
guide on how to deploy to vercel, but configure the environment variables so that `GITLAB_TOKEN_1` through
`GITLAB_TOKEN_7` contain tokens generated from your remote GitLab instances. When the [retryer](src/retryer.js) fails to
authenticate one token against a datasource, it will try the next numbered token in the environment.

Data Source Parameter Options:
| Option                    | Type    | Description                                                                                |
| ------------------------- | ------- | ------------------------------------------------------------------------------------------ |
| username                  | string  | username that maps to your `gitlab.com` account                                            |
| remote_username           | string  | username that maps to your `$remote_gitlab` account                                        |
| remote_gitlab             | string  | base url of your remote instance including `https://`                                      |
| combine_remote_and_public | boolean | setting to true will combine your stats from your remote gitlab and public gitlab accounts |

#### Putting It All Together

To create a stats card for the user `shnaru` at the remote GitLab instance `gitlab.notreal.com` (with the gitlab token
generated and added to your vercel instance) and combine it with `shnaru`'s public `gitlab.com` stats in one card, use
the following parameters:

```
?username=shnaru&remote_username=shnaru&remote_gitlab=gitlab.notreal.com&combine_remote_and_public=true
```

---

## Demo

- Default

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand)

- Hiding specific stats

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&hide=["mrs","projects","groups"])

- Showing icons

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&hide=["projects"]&show_icons=true)

- Themes

Choose from any of the [default themes](#themes)

![Oregand's gitlab stats](https://gitlab-readme-stats.vercel.app/api?username=oregand&show_icons=true&theme=dark)

## Deploy Yourself

Currently https://gitlab-readme-stats.vercel.app is not deployed, and using the above will cause an error to be
displayed. If you are interested in using gitlab-readme-stats for your profile, it may be useful to deploy an instance
of the app to vercel.

### Steps
1.  Go to [vercel.com](https://vercel.com/).
2.  Click on `Log in`.
3.  Sign in with GitLab by pressing `Continue with GitLab`.
4.  Sign in to GitLab and allow access to all repositories.
5.  Fork the current repo.
6.  Navigate to [Vercel dashboard](https://vercel.com/dashboard).
7.  To import a project, click the `Add New...` button and select the `Project` option.
8.  Click the `Continue with GitLab` button, and import your newly forked repo.
9.  Create a gitlab token [here](https://gitlab.com/-/profile/personal_access_tokens) and add `read_api`,
    `read_user`, `read_repository`.
10. Add the token as an environment variable named `GITLAB_TOKEN_1`.
11. Click deploy, and note the domain set by vercel so you can use it for your profile!

After deploying your own instance of gitlab-readme-stats, you will now be able to use the above examples with your own
vercel domain.

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
