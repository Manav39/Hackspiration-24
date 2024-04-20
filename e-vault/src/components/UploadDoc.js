import React, { useEffect } from "react";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Textarea,
  Toast,
  useToast,
} from "@chakra-ui/react";

import { Radio, RadioGroup } from "@chakra-ui/react";

import axios from "axios";
import { useState } from "react";
import { useContract } from "../context/context";
import { ethers } from "ethers";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
const UploadDoc = ({ onSuccess }) => {
  const toast = useToast();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const { account, contract } = useContract();
  const [url, setUrl] = useState("");
  const [caseJudge, setcaseJudge] = useState("");
  const [caseCode, setCaseCode] = useState("");
  const [section, setSection] = useState("");
  const [caseName, setCaseName] = useState("");
  const [value, setValue] = useState("Case");

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReaders();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    console.log(e.target.files[0].name);
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "e8b143c571986d7b7074",
            pinata_secret_api_key:
              "c60fe4549b60ae8f8dae9402ca841df7307d7947fbb90363cd7250b16d4cff8d",
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        console.log("Image hash: ", ImgHash);
        setUrl(ImgHash);
        toast({
          position: "top",
          title: "Document Uploaded Successfully",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
        setFileName("No image Uploaded");
        setFile(null);
      } catch (e) {
        alert(e);
      }
    }
  };

  const uploadDetails = async () => {
    try {
      const docRef = await addDoc(collection(db, "tests"), {
        name: localStorage.getItem("UserName"),
        email: localStorage.getItem("Email"),
        caseName: caseName,
        caseJudge: caseJudge,
        caseCode: caseCode,
        section: section,
        test: value,
        pdfUrl: url,
      });
      console.log("Document written with ID: ", docRef.id);
      toast({
        position: "top",
        title: "Details Uploaded Succesfully",
        status: "success",
        duration: 1500,
        isClosable: true,
      });
    } catch (err) {
      toast({
        position: "top",
        title: "Error While Uploading. Retry!",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
      console.log(err);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            {" "}
            TESTS DETAILS
          </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <FormControl id="title" isRequired>
                <FormLabel>Course Name</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => setCaseName(e.target.value)}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl id="title" isRequired>
                <FormLabel>Course Professor</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => setcaseJudge(e.target.value)}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl id="title" isRequired>
                <FormLabel>Course Code</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => setCaseCode(e.target.value)}
                />
              </FormControl>
            </HStack>
            <HStack>
              <FormControl isRequired>
                <FormLabel>Upload Test Paper</FormLabel>
                <Input
                  type="file"
                  id="file-upload"
                  name="data"
                  onChange={retrieveFile}
                />
              </FormControl>
              <Stack spacing={10} pt={7}>
                <Button
                  onClick={handleSubmit}
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Upload
                </Button>
              </Stack>
            </HStack>

            <HStack>
              <FormControl id="desc" isRequired>
                <FormLabel>Section of Course</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => setSection(e.target.value)}
                />
              </FormControl>
            </HStack>
            <HStack>
              <RadioGroup onChange={setValue} value={value}>
                <Stack direction="row">
                  <Radio value="Mid Term">Mid Term</Radio>
                  <Radio value="Final">Final</Radio>
                </Stack>
              </RadioGroup>
            </HStack>

            <Stack spacing={10} pt={2}>
              <Button
                onClick={uploadDetails}
                loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Add
              </Button>
            </Stack>
            <Stack pt={6}></Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default UploadDoc;