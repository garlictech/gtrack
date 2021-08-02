// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0


export const handler: CognitoUserPoolTriggerHandler = async event => {
  let expectedAnswer;
  if (event.request.privateChallengeParameters) {
    expectedAnswer = event.request.privateChallengeParameters.secretLoginCode;
  }
  if (event.request.challengeAnswer === expectedAnswer) {
    event.response.answerCorrect = true;
  } else {
    event.response.answerCorrect = false;
  }
  return event;
};
