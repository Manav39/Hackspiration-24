import React from 'react'
import { Card, CardHeader, Heading, CardBody, CardFooter, Button, Text, HStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Case = (c) => {
    return (
        <Card m={3}>
            <CardHeader>
                <HStack>
                    <Heading size='lg'>Case Name:</Heading>
                    <Heading size='md'>{ c.props.Name }</Heading>
                </HStack>
            </CardHeader>
            <CardBody>
                <HStack>
                    <Heading size='lg'>Client Description:</Heading>
                    <Text>{ c.props.Desc }</Text>
                </HStack>
            </CardBody>
            <CardFooter>
                <Link to={`/Cases/${c.props.id}`}>
                    <Button>View here</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default Case;