import { Octokit } from "@octokit/core";

export async function getFiles(org, repo, branch, path, token) {
    console.log(path)
    const ghClient = new Octokit({ auth: token });
    const response = await ghClient.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        {
            owner: org,
            repo: repo,
            ref: branch,
            path: path
        }
    );
    return response.data;
}

function base64ToUtf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

function utf8ToBase64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}


export async function getFileContent(org, repo, sha, token) {
    const ghClient = new Octokit({ auth: token });
    const response = await ghClient.request(
        "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
        {
            owner: org,
            repo: repo,
            file_sha: sha,
        }
    );
    return base64ToUtf8(response["data"]["content"]);
}

export async function commit(org, repo, branch, path, content, sha, token) {
    const ghClient = new Octokit({ auth: token});
    const response = await ghClient.request(
        "PUT /repos/{owner}/{repo}/contents/{path}",
        {
            owner: org,
            repo: repo,
            branch: branch,
            path: path,
            message: "update",
            content: utf8ToBase64(content),
            sha: sha,
        }
    );

    return response["data"]["content"]["sha"];

}

