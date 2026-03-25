# vw-web-git
大众WEB系统

### chenzhe的操作
- 提交V.0.1版本完整代码 2026/3/25


### git常用操作
1. git status
# 意思：查看本地有没有代码文件
2. git switch -c dev 
# 意思：创建并切换到 dev 分支（本地新建dev，如果只是切换去掉-c）
3. git switch -c chenzhe
# 意思：创建并切换到 chenzhe 分支（你的个人开发分支，如果只是切换去掉-c）
4. git add .
# 意思：把刚拷贝的所有代码，交给Git管理
5. git commit -m "chenzhe提交V.0.1版本完整代码"
# 意思：给代码打保存记录（代码现在只存在于 chenzhe 分支）
6. git switch dev
# 意思：切换回 dev 分支
7. git merge --no-ff -m "chenzhe提交V.0.1版本完整代码" chenzhe
# 意思：把 chenzhe分支 的代码合并到 dev分支
8. git push -u origin dev
# 意思：把 dev 分支推送到GitHub