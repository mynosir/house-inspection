--
-- 数据库: `house-inspection`
--
set names utf8;
create database `house-inspection`;
use `house-inspection`;

-- --------------------------------------------------------

--
-- 表的结构 `sys_sessions`
--
CREATE TABLE IF NOT EXISTS `sys_sessions` (
  `session_id` varchar(40) NOT NULL DEFAULT '0',
  `ip_address` varchar(45) NOT NULL DEFAULT '0',
  `user_agent` varchar(120) NOT NULL,
  `last_activity` int(10) unsigned NOT NULL DEFAULT '0',
  `user_data` text NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `last_activity_idx` (`last_activity`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


-- linzequan 20171125
-- 添加应用菜单表
create table `sys_menu` (
    `id` int not null auto_increment comment '自增id',
    `pid` int default 0 comment '上级菜单id',
    `name` varchar(128) comment '菜单标题',
    `ctrl_name` varchar(255) comment '菜单栏访问控制器',
    `sort` int default 10 comment '菜单排序',
    `mark` varchar(32) comment '标志',
    `create_time` int(11) not null comment '创建时间',
    `update_time` int(11) comment '更新时间',
    `create_userid` int not null comment '创建者id',
    `update_userid` int comment '更新者id',
    primary key (`id`)
) engine = myisam character set utf8 collate utf8_general_ci comment = '应用菜单表';


-- linzequan 20171125
-- 添加角色表
create table `sys_role` (
    `id` int not null auto_increment comment '自增id',
    `name` varchar(128) comment '角色名称',
    `pms` varchar(255) comment '菜单栏id，多个id以英文逗号分隔',
    `create_time` int(11) not null comment '创建时间',
    `update_time` int(11) comment '更新时间',
    `create_userid` int not null comment '创建者id',
    `update_userid` int comment '更新者id',
    primary key (`id`)
) engine = myisam character set utf8 collate utf8_general_ci comment = '角色表';


-- linzequan 20171125
-- 添加后台管理员表
create table `sys_admin` (
    `id` int not null auto_increment comment '自增id',
    `username` varchar(128) not null comment '用户名',
    `realname` varchar(128) comment '真实姓名',
    `telephone` varchar(32) comment '手机号码',
    `email` varchar(128) comment '邮箱',
    `password` varchar(32) comment '密码',
    `role_id` int comment '角色id',
    `is_admin` int default 0 comment '是否超级管理员。0不是，1是',
    `status` int(2) not null default 0 comment '状态。0启用，1删除',
    `create_time` int(11) not null comment '创建时间',
    `update_time` int(11) comment '更新时间',
    `create_userid` int not null comment '创建者id',
    `update_userid` int comment '更新者id',
    primary key (`id`)
) engine = myisam character set utf8 collate utf8_general_ci comment = '用户表';


-- linzequan 20171125
-- 添加日志表
create table `sys_log` (
    `id` int not null auto_increment comment '自增id',
    `userid` int comment '操作者id',
    `content` text comment '操作内容',
    `create_time` int(11) not null comment '记录时间戳',
    primary key (`id`)
) engine = myisam character set utf8 collate utf8_general_ci comment = '日志表';


-- linzequan 20171125
-- 添加默认超级管理员
insert into `sys_admin` (`username`, `realname`, `telephone`, `email`, `password`, `role_id`, `is_admin`, `status`, `create_time`, `update_time`, `create_userid`, `update_userid`) values ('admin', '超级管理员', '18665953630', '361789273@qq.com', 'e10adc3949ba59abbe56e057f20f883e', '0', '1', '0', '1503592655', NULL , '1', NULL);
