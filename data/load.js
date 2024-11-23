const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
const chalk = require('chalk');
dotenv.config();

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 'usebruno';
const REPO_NAME = 'bruno';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
console.log(GITHUB_TOKEN);

async function getGithubData(endpoint) {
  const response = await axios.get(`${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/${endpoint}`, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  return response.data;
}

async function getGithubDataWithPagination(endpoint) {
  let page = 1;
  let allData = [];
  
  console.log(chalk.blue(`🔄 Starting pagination for ${chalk.bold(endpoint)}`));
  
  while (true) {
    try {
      const response = await axios.get(
        `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/${endpoint}${endpoint.includes('?') ? '&' : '?'}page=${page}&per_page=100`,
        {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      if (response.data.length === 0) {
        console.log(chalk.green(`✅ Completed fetching all pages for ${chalk.bold(endpoint)}`));
        break;
      }
      
      allData = [...allData, ...response.data];
      console.log(chalk.cyan(`📥 Fetched page ${chalk.bold(page)} with ${chalk.bold(response.data.length)} items`));
      page++;
    } catch (error) {
      console.error(chalk.red(`❌ Error fetching page ${page}: ${error.message}`));
      throw error;
    }
  }
  
  return allData;
}

async function saveJsonToFile(data, filename) {
    const dirPath = path.join(__dirname, 'github-data');
    const filePath = path.join(dirPath, filename);
  
    // Create the directory if it doesn't exist
    await fs.mkdir(dirPath, { recursive: true });
  
    // Write the JSON data to the file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function loadAllGithubData() {
  try {
    console.log(chalk.yellow('\n📊 Starting GitHub Data Collection'));
    
    console.log(chalk.magenta('\n📌 Fetching all issues...'));
    const issues = await getGithubDataWithPagination('issues?state=all');
    await saveJsonToFile(issues, 'issues.json');
    console.log(chalk.green(`✅ Successfully saved ${chalk.bold(issues.length)} issues to data/issues.json`));

    console.log(chalk.magenta('\n🔄 Fetching pull requests...'));
    const closedPrs = await getGithubDataWithPagination('pulls?state=all');
    await saveJsonToFile(closedPrs, 'prs.json');
    console.log(chalk.green('✅ Successfully saved PRs to data/prs.json'));

    console.log(chalk.magenta('\n🏷️  Fetching releases...'));
    const releases = await getGithubDataWithPagination('releases');
    await saveJsonToFile(releases, 'releases.json');
    console.log(chalk.green('✅ Successfully saved releases to data/releases.json'));

    // Add meta information
    const meta = {
      updatedAt: new Date().toISOString()
    };
    await saveJsonToFile(meta, 'meta.json');
    console.log(chalk.green('✅ Successfully saved metadata to data/meta.json'));

    console.log(chalk.green.bold('\n✨ All GitHub data loaded and saved successfully! ✨'));
  } catch (error) {
    console.error(chalk.red.bold(`\n❌ Error loading GitHub data: ${error.message}`));
    throw error;
  }
}

loadAllGithubData();