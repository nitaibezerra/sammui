<?php

namespace Renatomefi\ApiBundle\Tests\Auth;

use Symfony\Component\HttpFoundation\Response;

/**
 * Class AssertOAuth
 * @package Renatomefi\ApiBundle\Tests\Auth
 */
trait AssertOAuth
{

    /**
     * @inheritdoc
     */
    protected function assertOAuthError(Response $responseObj)
    {
        $response = json_decode($responseObj->getContent());

        $this->assertSame(401, $responseObj->getStatusCode());

        $this->assertTrue(($response instanceof \stdClass));

        $this->assertObjectHasAttribute('error', $response);
        $this->assertObjectHasAttribute('error_description', $response);
    }

    /**
     * @inheritdoc
     */
    protected function assertOAuthRequired(Response $responseObj)
    {
        $response = json_decode($responseObj->getContent());

        $this->assertOAuthError($responseObj);

        $this->assertEquals('access_denied', $response->error);
        $this->assertEquals('OAuth2 authentication required', $response->error_description);
    }

    /**
     * @inheritdoc
     */
    protected function assertOAuthInvalidToken(Response $responseObj)
    {
        $response = json_decode($responseObj->getContent());

        $this->assertOAuthError($responseObj);

        $this->assertEquals('invalid_grant', $response->error);
        $this->assertEquals('The access token provided is invalid.', $response->error_description);
    }

}