const mockMessagesCreate = jest.fn();
const TwilioMock = jest.fn((accountSid, authToken) => ({
  messages: {
    create: mockMessagesCreate,
  },
}));

export default TwilioMock;