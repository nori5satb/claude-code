#!/bin/bash

# plan-github-issue.md - GitHubのissueに対する実行計画をsub-issueとして作成するカスタムコマンド
# 使用法: ./plan-github-issue.md <issue-number>

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
    echo "エラー: Issue #${ISSUE_NUMBER} が見つかりません"
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

# 実行計画の生成
PLAN_TITLE="実行計画: $ISSUE_TITLE"

# 実行計画のテンプレート
PLAN_BODY="## 📝 実行計画

この issue は #${ISSUE_NUMBER} の実装計画です。

### 🎯 目的
$ISSUE_TITLE

### 📋 実行手順

#### 1. 要件分析・調査
- [ ] 既存コードの調査と理解
- [ ] 関連するファイルやコンポーネントの特定
- [ ] 依存関係の確認
- [ ] 技術的制約の洗い出し

#### 2. 設計・計画
- [ ] アーキテクチャの設計
- [ ] データ構造の設計
- [ ] API設計（必要に応じて）
- [ ] UIコンポーネントの設計（必要に応じて）

#### 3. 実装
- [ ] コア機能の実装
- [ ] UI実装（必要に応じて）
- [ ] エラーハンドリングの実装
- [ ] バリデーション処理の実装

#### 4. テスト
- [ ] 単体テストの作成・実行
- [ ] 統合テストの作成・実行
- [ ] E2Eテストの作成・実行（必要に応じて）
- [ ] 手動テストの実行

#### 5. ドキュメント・最終確認
- [ ] コードレビュー
- [ ] ドキュメントの更新
- [ ] CHANGELOG.mdの更新
- [ ] Lint・TypeCheckの実行
- [ ] 最終動作確認

### 🔗 関連Issue
- 親Issue: #${ISSUE_NUMBER}

### 📝 実装メモ
<!-- 実装中に気づいた点や注意事項を記録 -->

### ✅ 完了条件
- [ ] すべての実行手順が完了している
- [ ] テストがすべて通過している
- [ ] コードレビューが完了している
- [ ] 親Issue #${ISSUE_NUMBER} の要件が満たされている

---
*このissueは \`plan-github-issue.md\` コマンドによって自動生成されました*"

echo "📝 実行計画のsub-issueを作成中..."

# Sub-issueの作成
if CREATED_ISSUE=$(gh issue create \
    --title "$PLAN_TITLE" \
    --body "$PLAN_BODY" \
    --label "enhancement,planning" \
    --assignee "@me" 2>/dev/null); then
    
    CREATED_ISSUE_NUMBER=$(echo "$CREATED_ISSUE" | grep -o '#[0-9]\+' | sed 's/#//')
    
    echo "✅ 実行計画のsub-issueが作成されました!"
    echo "   Issue URL: $CREATED_ISSUE"
    echo "   Issue Number: #$CREATED_ISSUE_NUMBER"
    
    # 親Issueにコメントを追加
    COMMENT_BODY="📋 実行計画のsub-issueを作成しました: #${CREATED_ISSUE_NUMBER}

このissueの実装は #${CREATED_ISSUE_NUMBER} で計画・追跡されます。"
    
    if gh issue comment "$ISSUE_NUMBER" --body "$COMMENT_BODY" &> /dev/null; then
        echo "   親Issue #${ISSUE_NUMBER} にコメントを追加しました"
    fi
    
    echo
    echo "🚀 次のステップ:"
    echo "   1. Issue #${CREATED_ISSUE_NUMBER} を確認"
    echo "   2. 実行計画を必要に応じて調整"
    echo "   3. チェックリストに従って実装を開始"
    
else
    echo "❌ エラー: Sub-issueの作成に失敗しました"
    exit 1
fi