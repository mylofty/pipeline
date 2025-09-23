/**
 * 语法检查工具
 * 用于验证JavaScript文件的语法正确性
 */

class SyntaxChecker {
  
  /**
   * 检查所有数据库相关文件的语法
   */
  checkAllFiles() {
    const results = [];
    
    try {
      // 检查数据库管理器
      import('@/utils/database.js').then(() => {
        results.push({ file: 'database.js', status: 'OK' });
      }).catch(error => {
        results.push({ file: 'database.js', status: 'ERROR', error: error.message });
      });
      
      // 检查SQLite适配器
      import('@/utils/sqliteAdapter.js').then(() => {
        results.push({ file: 'sqliteAdapter.js', status: 'OK' });
      }).catch(error => {
        results.push({ file: 'sqliteAdapter.js', status: 'ERROR', error: error.message });
      });
      
      // 检查简单适配器
      import('@/utils/simpleDatabaseAdapter.js').then(() => {
        results.push({ file: 'simpleDatabaseAdapter.js', status: 'OK' });
      }).catch(error => {
        results.push({ file: 'simpleDatabaseAdapter.js', status: 'ERROR', error: error.message });
      });
      
      // 检查服务文件
      const services = [
        'projectService.js',
        'pipePointService.js', 
        'pipeLineService.js',
        'settingsService.js',
        'dataService.js'
      ];
      
      services.forEach(service => {
        import(`@/services/${service}`).then(() => {
          results.push({ file: service, status: 'OK' });
        }).catch(error => {
          results.push({ file: service, status: 'ERROR', error: error.message });
        });
      });
      
    } catch (error) {
      console.error('语法检查失败:', error);
    }
    
    return results;
  }
  
  /**
   * 输出检查结果
   */
  printResults(results) {
    console.log('=== 语法检查结果 ===');
    results.forEach(result => {
      if (result.status === 'OK') {
        console.log(`✓ ${result.file}: 语法正确`);
      } else {
        console.error(`✗ ${result.file}: ${result.error}`);
      }
    });
  }
}

export default new SyntaxChecker();