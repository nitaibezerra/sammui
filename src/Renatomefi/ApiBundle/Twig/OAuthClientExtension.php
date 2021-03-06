<?php

namespace Renatomefi\ApiBundle\Twig;

use FOS\OAuthServerBundle\Document\ClientManager;
use Renatomefi\ApiBundle\DataFixtures\MongoDB\LoadOAuthClient;

/**
 * Class OAuthClientExtension
 * @package Renatomefi\ApiBundle\Twig
 */
class OAuthClientExtension extends \Twig_Extension
{

    /**
     * @var ClientManager
     */
    protected $clientManager;

    /**
     * @param ClientManager $clientManager
     */
    public function __construct(ClientManager $clientManager)
    {
        $this->clientManager = $clientManager;
    }

    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'oauth_client_extension';
    }

    /**
     * @inheritdoc
     */
    public function getGlobals()
    {

        $client = $this->clientManager->findClientBy(['name' => LoadOAuthClient::$appClientName]);

        if (!$client) {
            $err = 'no-client-found-for-' . LoadOAuthClient::$appClientName;
            return [
                'OAuthClientId' => $err,
                'OAuthClientSecret' => $err
            ];
        }

        return [
            'OAuthClientId' => $client->getPublicId(),
            'OAuthClientSecret' => $client->getSecret()
        ];
    }
}