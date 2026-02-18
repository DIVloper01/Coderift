import axios from 'axios';

// Judge0 language IDs mapping
export const LANGUAGE_IDS = {
  c: 50,
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
  go: 60,
  rust: 73,
};

class JudgeService {
  constructor() {
    this.apiKey = process.env.JUDGE0_API_KEY;
    this.apiHost = process.env.JUDGE0_API_HOST;
    this.baseURL = `https://${this.apiHost}`;
  }

  async submitCode(code, languageId, input, timeLimit = 2, memoryLimit = 256000) {
    try {
      const options = {
        method: 'POST',
        url: `${this.baseURL}/submissions`,
        params: { base64_encoded: 'false', wait: 'false' },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': this.apiHost,
        },
        data: {
          language_id: languageId,
          source_code: code,
          stdin: input,
          cpu_time_limit: timeLimit,
          memory_limit: memoryLimit,
        },
      };

      const response = await axios.request(options);
      return response.data.token;
    } catch (error) {
      console.error('Judge0 submission error:', error.response?.data || error.message);
      throw new Error('Failed to submit code to Judge0');
    }
  }

  async getSubmissionResult(token, maxRetries = 10, delay = 1000) {
    try {
      for (let i = 0; i < maxRetries; i++) {
        const options = {
          method: 'GET',
          url: `${this.baseURL}/submissions/${token}`,
          params: { base64_encoded: 'false' },
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': this.apiHost,
          },
        };

        const response = await axios.request(options);
        const result = response.data;

        // Status IDs: 1=In Queue, 2=Processing, 3=Accepted, 4=Wrong Answer, etc.
        if (result.status.id > 2) {
          return this.parseResult(result);
        }

        // Wait before next poll
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      throw new Error('Submission timeout');
    } catch (error) {
      console.error('Judge0 result fetch error:', error.response?.data || error.message);
      throw new Error('Failed to fetch submission result');
    }
  }

  parseResult(result) {
    const statusMap = {
      3: 'Accepted',
      4: 'Wrong Answer',
      5: 'Time Limit Exceeded',
      6: 'Compilation Error',
      7: 'Runtime Error (SIGSEGV)',
      8: 'Runtime Error (SIGXFSZ)',
      9: 'Runtime Error (SIGFPE)',
      10: 'Runtime Error (SIGABRT)',
      11: 'Runtime Error (NZEC)',
      12: 'Runtime Error (Other)',
      13: 'Internal Error',
      14: 'Exec Format Error',
    };

    return {
      verdict: statusMap[result.status.id] || 'Internal Error',
      executionTime: result.time ? parseFloat(result.time) * 1000 : null, // Convert to ms
      memory: result.memory || null, // Already in KB
      output: result.stdout || '',
      error: result.stderr || result.compile_output || '',
      statusId: result.status.id,
    };
  }

  async executeTestCases(code, languageId, testCases, timeLimit, memoryLimit) {
    const results = [];

    for (const testCase of testCases) {
      try {
        const token = await this.submitCode(
          code,
          languageId,
          testCase.input,
          timeLimit,
          memoryLimit * 1024 // Convert MB to KB
        );

        const result = await this.getSubmissionResult(token);
        
        const passed = result.output.trim() === testCase.expectedOutput.trim() && 
                      result.verdict === 'Accepted';

        results.push({
          testCaseId: testCase._id,
          passed,
          executionTime: result.executionTime,
          memory: result.memory,
          output: result.output,
          error: result.error,
        });

        // If any test fails, we can optionally stop early
        if (!passed && !testCase.isSample) {
          // Continue testing all cases for detailed feedback
        }
      } catch (error) {
        results.push({
          testCaseId: testCase._id,
          passed: false,
          executionTime: null,
          memory: null,
          output: '',
          error: error.message,
        });
      }
    }

    return results;
  }

  determineVerdict(testResults) {
    const allPassed = testResults.every((result) => result.passed);
    
    if (allPassed) return 'Accepted';
    
    const hasError = testResults.some((result) => result.error && result.error.length > 0);
    if (hasError) {
      const errorResult = testResults.find((r) => r.error);
      if (errorResult.error.includes('Compilation')) return 'Compilation Error';
      if (errorResult.error.includes('Time Limit')) return 'Time Limit Exceeded';
      return 'Runtime Error';
    }
    
    return 'Wrong Answer';
  }
}

export default new JudgeService();
