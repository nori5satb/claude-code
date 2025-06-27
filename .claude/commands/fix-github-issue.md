#!/bin/bash

# fix-github-issue.md - GitHubのissueの実行計画に沿って実装し、コミットメッセージを作成するカスタムコマンド
# 使用法: ./fix-github-issue.md <issue-number>

set -e

# 引数チェック
if [ $# -ne 1 ]; then
    echo "使用法: $0 <issue-number>"
    echo "例: $0 123"
    exit 1
fi

ISSUE_NUMBER=$1

# GitHub CLIの存在確認
if ! command -v gh &> /dev/null; then
    echo "エラー: GitHub CLI (gh) がインストールされていません"
    echo "インストール方法: https://cli.github.com/manual/installation"
    exit 1
fi

# GitHubリポジトリかどうか確認
if ! git rev-parse --is-inside-work-tree &> /dev/null; then
    echo "エラー: このディレクトリはGitリポジトリではありません"
    exit 1
fi

# GitHub認証確認
if ! gh auth status &> /dev/null; then
    echo "エラー: GitHub CLIにログインしていません"
    echo "ログイン方法: gh auth login"
    exit 1
fi

echo "🔍 Issue #${ISSUE_NUMBER} の情報を取得中..."

# Issueの存在確認と情報取得
if ! ISSUE_INFO=$(gh issue view "$ISSUE_NUMBER" --json title,body,labels,assignees,state 2>/dev/null); then
    echo "❌ エラー: Issue #${ISSUE_NUMBER} が見つかりません"
    exit 1
fi

# JSONからタイトルと本文を抽出
ISSUE_TITLE=$(echo "$ISSUE_INFO" | jq -r '.title')
ISSUE_BODY=$(echo "$ISSUE_INFO" | jq -r '.body // ""')
ISSUE_STATE=$(echo "$ISSUE_INFO" | jq -r '.state')

if [ "$ISSUE_STATE" = "CLOSED" ]; then
    echo "⚠️  警告: Issue #${ISSUE_NUMBER} はクローズされています"
    read -p "続行しますか？ (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "処理を中止しました"
        exit 0
    fi
fi

echo "📋 Issue情報:"
echo "  タイトル: $ISSUE_TITLE"
echo "  状態: $ISSUE_STATE"
echo

# 作業ブランチの作成
BRANCH_NAME="fix/issue-${ISSUE_NUMBER}"
CURRENT_BRANCH=$(git branch --show-current)

echo "🌿 作業ブランチを作成中..."
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo "  ブランチ '$BRANCH_NAME' は既に存在します"
    echo "  既存のブランチに切り替えますか？ (y/N): "
    read -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout "$BRANCH_NAME"
    else
        echo "処理を中止しました"
        exit 0
    fi
else
    git checkout -b "$BRANCH_NAME"
    echo "  ブランチ '$BRANCH_NAME' を作成しました"
fi

# 実行計画の実行
echo "🚀 実装を開始します..."
echo "📝 Issue内容を確認してください:"
echo "---"
echo "$ISSUE_BODY"
echo "---"
echo

# ここからClaude Codeに処理を委譲
echo "🤖 Claude Codeによる実装を開始..."
claude code --prompt "GitHub Issue #${ISSUE_NUMBER} の実装を行ってください。

Issue タイトル: $ISSUE_TITLE

Issue 内容:
$ISSUE_BODY

以下の手順で実装してください:
1. 既存コードの調査と理解
2. 要件に基づく実装
3. テストの作成・実行
4. Lint・TypeCheckの実行
5. 動作確認

実装が完了したら、適切なコミットメッセージを作成してください。
コミットメッセージは以下の形式でお願いします:

feat/fix/docs/style/refactor/test/chore: <簡潔な説明>

<詳細な説明（必要に応じて）>

Closes #${ISSUE_NUMBER}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 実装完了後の処理
echo
echo "✅ 実装が完了しました!"
echo
echo "🔄 次のステップ:"
echo "  1. 変更内容を確認: git diff"
echo "  2. ステージング: git add ."
echo "  3. コミット: git commit (メッセージは既に準備されています)"
echo "  4. プッシュ: git push -u origin $BRANCH_NAME"
echo "  5. プルリクエスト作成: gh pr create"
echo

# プルリクエスト作成の提案
echo "プルリクエストを作成しますか？ (y/N): "
read -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # 変更があるかチェック
    if git diff --quiet && git diff --cached --quiet; then
        echo "⚠️  変更がコミットされていません"
        echo "先にコミットを作成してください"
    else
        # リモートにプッシュ
        if git push -u origin "$BRANCH_NAME" 2>/dev/null; then
            # プルリクエスト作成
            PR_TITLE="$ISSUE_TITLE"
            PR_BODY="## 概要
$ISSUE_TITLE

## 変更内容
<!-- 実装内容を記述 -->

## テスト
- [ ] 単体テストの実行
- [ ] 統合テストの実行
- [ ] 手動テストの実行

## チェックリスト
- [ ] Lint・TypeCheckが通過している
- [ ] テストが通過している
- [ ] ドキュメントが更新されている（必要に応じて）

Closes #${ISSUE_NUMBER}

🤖 Generated with [Claude Code](https://claude.ai/code)"

            if PR_URL=$(gh pr create --title "$PR_TITLE" --body "$PR_BODY" 2>/dev/null); then
                echo "✅ プルリクエストが作成されました!"
                echo "   URL: $PR_URL"
            else
                echo "❌ プルリクエストの作成に失敗しました"
            fi
        else
            echo "❌ リモートブランチへのプッシュに失敗しました"
        fi
    fi
fi

echo
echo "🎉 Issue #${ISSUE_NUMBER} の実装作業が完了しました!"