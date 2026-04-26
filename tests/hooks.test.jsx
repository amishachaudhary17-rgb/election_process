import { renderHook, act } from '@testing-library/react';
import { useChat } from '../frontend/src/hooks/useChat';

describe('useChat Custom Hook Integration Testing', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('Should initialize with greeting message and process user send natively', async () => {
    const mockUser = { displayName: 'Tester' };
    const mockRole = 'student';
    const mockLang = 'spanish';

    // Mock successful fetch logic
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: 'AI response successfully triggered.' }),
    });

    const { result } = renderHook(() => useChat(mockUser, mockRole, mockLang));
    
    // Validate initialization mapping
    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].sender).toBe('bot');
    
    // Trigger Send
    await act(async () => {
      await result.current.sendMessage('How do I register online?');
    });

    // Validates that it correctly created both User request and Bot response payload logs
    expect(result.current.messages.length).toBe(3);
    expect(result.current.messages[2].text).toBe('AI response successfully triggered.');
  });
  
  test('Should block submission of entirely empty/malformed text strings natively to save memory', async () => {
      const { result } = renderHook(() => useChat({}, 'citizen', 'english'));
      
      await act(async () => {
          await result.current.sendMessage('    '); // Empty 
      });

      // Validates array length stays at one (greeting only)
      expect(result.current.messages.length).toBe(1);
      expect(global.fetch).not.toHaveBeenCalled();
  });

});
