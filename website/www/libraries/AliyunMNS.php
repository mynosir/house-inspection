<?php
if(!defined('ALIYUNMNS_ROOT')) {
    define('ALIYUNMNS_ROOT', dirname(__FILE__) . '/');
}
require_once(ALIYUNMNS_ROOT . 'aliyunmns/mns-autoloader.php');
use AliyunMNS\Client;
use AliyunMNS\Topic;
use AliyunMNS\Constants;
use AliyunMNS\Model\MailAttributes;
use AliyunMNS\Model\SmsAttributes;
use AliyunMNS\Model\BatchSmsAttributes;
use AliyunMNS\Model\MessageAttributes;
use AliyunMNS\Exception\MnsException;
use AliyunMNS\Requests\PublishMessageRequest;

class AliyunMNS {

    private $endPoint;
    private $accessId;
    private $accessKey;
    private $topicName;
    private $client;
    private $topic;


    /**
     * 初始化
     * @param  [type] $endPoint  [description]
     * @param  [type] $accessId  [description]
     * @param  [type] $accessKey [description]
     * @return [type]            [description]
     */
    public function init($endPoint, $accessId, $accessKey, $topicName='sms.topic-cn-shenzhen') {
        $this->endPoint = $endPoint;
        $this->accessId = $accessId;
        $this->accessKey = $accessKey;
        $this->topicName = $topicName;
        // 初始化Client
        $this->client = new Client($this->endPoint, $this->accessId, $this->accessKey);
        // 获取主题应用
        $this->topic = $this->client->getTopicRef($topicName);
    }


    public function run($SMSSignName, $SMSTemplateCode, $receiver, $params=array()) {
        // 生成SMS消息属性
        // 设置发送短信的签名（SMSSignName）和模板（SMSTemplateCode）
        $batchSmsAttributes = new BatchSmsAttributes($SMSSignName, $SMSTemplateCode);
        // （如果在短信模板定义了参数）指定短信模板中对应参数的值
        $batchSmsAttributes->addReceiver($receiver, $params);
        $messageAttributes = new MessageAttributes(array($batchSmsAttributes));
        // 设置SMS消息体（必须）
        $messageBody = 'smsmessage';
        // 发布SMS消息
        $request = new PublishMessageRequest($messageBody, $messageAttributes);
        try {
            $res = $this->topic->publishMessage($request);
            return array('isSucceed'=> $res->isSucceed(), 'msgId'=> $res->getMessageId());
        } catch (MnsException $e) {
            return array('e'=> $e);
        }
    }
}
// $instance = new PublishBatchSMSMessageDemo();
// $instance->run();
