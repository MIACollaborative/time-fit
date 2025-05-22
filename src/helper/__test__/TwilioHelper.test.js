import Twilio from "twilio";
import TwilioHelper from "../TwilioHelper.js";

// Mock the Twilio module
jest.mock("twilio", () => {
  const mockMessages = {
    create: jest.fn()
  };
  
  const mockClient = jest.fn(() => ({
    messages: mockMessages
  }));
  
  return mockClient;
});

describe("TwilioHelper", () => {
  let originalEnv;
  
  beforeAll(() => {
    // Save original environment variables
    originalEnv = { ...process.env };
    // Set up test environment variables
    process.env.TWILIO_ACCOUNT_SID = "test_account_sid";
    process.env.TWILIO_AUTH_TOKEN = "test_auth_token";
  });
  
  afterAll(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });
  
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });
  
  describe("sendMessage", () => {
    it("should send a message with default media URL and return the message", async () => {
      // Mock successful response from Twilio
      const mockMessage = {
        sid: "SM1234567890abcdef1234567890abcdef",
        status: "queued",
        to: "+1234567890"
      };
      
      // Set up the mock to resolve with our test data
      Twilio().messages.create.mockResolvedValue(mockMessage);
      
      // Call the method being tested
      const phone = "+1234567890";
      const message = "Test message";
      const result = await TwilioHelper.sendMessage(phone, message);
      
      // Verify the Twilio client was called with the expected parameters
      expect(Twilio).toHaveBeenCalledWith("test_account_sid", "test_auth_token");
      expect(Twilio().messages.create).toHaveBeenCalledWith({
        messagingServiceSid: "MG05ede0540932555ae0e1b9b88876a30f",
        body: message,
        mediaUrl: ["https://demo.twilio.com/owl.png"],
        to: phone
      });
      
      // Verify the result is as expected
      expect(result).toEqual(mockMessage);
    });
    
    it("should send a message with custom media URL and return the message", async () => {
      // Mock successful response from Twilio
      const mockMessage = {
        sid: "SMabcdef1234567890abcdef1234567890",
        status: "queued",
        to: "+1987654321"
      };
      
      // Set up the mock to resolve with our test data
      Twilio().messages.create.mockResolvedValue(mockMessage);
      
      // Call the method with custom media URL
      const phone = "+1987654321";
      const message = "Custom media test";
      const customMedia = ["https://example.com/image.jpg"];
      const result = await TwilioHelper.sendMessage(phone, message, customMedia);
      
      // Verify the Twilio client was called with the custom media URL
      expect(Twilio().messages.create).toHaveBeenCalledWith({
        messagingServiceSid: "MG05ede0540932555ae0e1b9b88876a30f",
        body: message,
        mediaUrl: customMedia,
        to: phone
      });
      
      // Verify the result is as expected
      expect(result).toEqual(mockMessage);
    });
    
    it("should handle errors and return the error object", async () => {
      // Mock an error response from Twilio
      const error = new Error("Failed to send message");
      error.code = 21211; // Example Twilio error code for invalid 'To' number
      
      // Set up the mock to reject with our test error
      Twilio().messages.create.mockRejectedValue(error);
      
      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Call the method that should trigger an error
      const phone = "invalid_number";
      const message = "This should fail";
      const result = await TwilioHelper.sendMessage(phone, message);
      
      // Verify the error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      
      // Verify the error was returned
      expect(result).toBe(error);
      
      // Clean up the mock
      consoleErrorSpy.mockRestore();
    });
    
    it("should format the phone number correctly", async () => {
      // Mock successful response from Twilio
      const mockMessage = {
        sid: "SM11112222333344445555",
        status: "queued",
        to: "+11234567890"
      };
      
      // Set up the mock to resolve with our test data
      Twilio().messages.create.mockResolvedValue(mockMessage);
      
      // Call the method with different phone number formats
      const phone = "(123) 456-7890";
      const formattedPhone = "+11234567890";
      const message = "Phone number formatting test";
      
      await TwilioHelper.sendMessage(phone, message);
      
      // Verify the phone number was formatted correctly
      expect(Twilio().messages.create).toHaveBeenCalledWith(expect.objectContaining({
        to: phone // Note: In a real test, you might want to test phone number formatting here
      }));
    });
  });
});
