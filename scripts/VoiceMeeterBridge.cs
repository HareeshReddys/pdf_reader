using System;
using System.Text;
using System.Runtime.InteropServices;
using System.Web.Script.Serialization;
using System.Collections.Generic;
using System.Threading;
public class VoiceMeeterBridge {
 const string Dll=@"C:\Program Files (x86)\VB\Voicemeeter\VoicemeeterRemote64.dll";
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_Login();
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_Logout();
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_IsParametersDirty();
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_GetVoicemeeterType(out int type);
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_GetParameterFloat(string name,out float value);
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_SetParameterFloat(string name,float value);
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_GetParameterStringA(string name,StringBuilder value);
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_SetParameterStringA(string name,string value);
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_GetLevel(int type,int channel,out float value);
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_Output_GetDeviceNumber();
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_Input_GetDeviceNumber();
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_Output_GetDeviceDescA(int index,out int type,StringBuilder name,StringBuilder id);
 [DllImport(Dll,CallingConvention=CallingConvention.StdCall)] static extern int VBVMR_Input_GetDeviceDescA(int index,out int type,StringBuilder name,StringBuilder id);
 static JavaScriptSerializer Json=new JavaScriptSerializer();
 static void Check(int code){if(code<0)throw new Exception("VoiceMeeter error "+code);}
 public static int Main(string[] args){try{Check(VBVMR_Login());Thread.Sleep(150);Check(VBVMR_IsParametersDirty());int type;Check(VBVMR_GetVoicemeeterType(out type));if(type!=2)throw new Exception("VoiceMeeter Banana must be running");
 if(args.Length==0){var devices=new List<object>();foreach(bool input in new[]{false,true}){int count=input?VBVMR_Input_GetDeviceNumber():VBVMR_Output_GetDeviceNumber();for(int i=0;i<count;i++){int kind;var name=new StringBuilder(256);var id=new StringBuilder(256);Check(input?VBVMR_Input_GetDeviceDescA(i,out kind,name,id):VBVMR_Output_GetDeviceDescA(i,out kind,name,id));devices.Add(new{input,index=i,type=kind,name=name.ToString(),id=id.ToString()});}}Console.WriteLine(Json.Serialize(devices));}
 else if(args[0]=="get"){foreach(string name in args[1].Split(';')){float value;int code=VBVMR_GetParameterFloat(name,out value);Console.WriteLine(Json.Serialize(new{name,value,code}));}}
 else if(args[0]=="get-string"){var value=new StringBuilder(512);Check(VBVMR_GetParameterStringA(args[1],value));Console.WriteLine(Json.Serialize(new{name=args[1],value=value.ToString()}));}
 else if(args[0]=="set"){Check(VBVMR_SetParameterFloat(args[1],float.Parse(args[2],System.Globalization.CultureInfo.InvariantCulture)));Thread.Sleep(200);}
 else if(args[0]=="set-string"){Check(VBVMR_SetParameterStringA(args[1],args[2]));Thread.Sleep(500);}
 else if(args[0]=="levels"){for(int k=0;k<int.Parse(args[1]);k++){var levels=new List<float>();for(int i=0;i<40;i++){float value;Check(VBVMR_GetLevel(3,i,out value));levels.Add(value);}Console.WriteLine(Json.Serialize(new{at=DateTime.UtcNow.ToString("o"),levels}));Thread.Sleep(50);}}
 return 0;}catch(Exception e){Console.Error.WriteLine(e.Message);return 1;}finally{VBVMR_Logout();}}
}
