# MemFireBBS
helloBBS是一个可以对生活、学习、问答、情感发出任何表达的小论坛


## 介绍

小程序用到的MemFire Cloud的功能包括：
- 云数据库：存储小程序数据表的信息。
- 用户验证：小程序使用MemFire Cloud提供的用户认证的API接口，快速完成用户注册登录操作。
- 云存储：存储小程序的注册用户上传的头像。
- 行级安全策略：采用RLS策略来限制用户访问行为，用户可以上传图片。
- 即时API：创建数据表时会自动生成 API。

## 主要使用

下载小程序需要的Supabase 小程序客户端

```sh
npm install supabase-wechat-stable-v2
```

```js
import { createClient } from 'supabase-wechat-stable-v2'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.baseapi.memfiredb.com', 'service_role')
